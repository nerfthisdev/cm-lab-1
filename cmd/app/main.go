package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/nerfthisdev/cm-lab-1/internal/linearal"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func handleReq(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var inputData struct {
		Matrix  [][]float64 `json:"matrix"`
		Vector  []float64   `json:"vector"`
		Epsilon float64     `json:"epsilon"`
	}

	err := json.NewDecoder(r.Body).Decode(&inputData)
	if err != nil {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	A := inputData.Matrix
	b := inputData.Vector
	tol := inputData.Epsilon

	log.Println(A)
	log.Println(b)
	log.Println(tol)

	ARearranged, bRearranged, success, flag, alreadyHas := linearal.RearrangeMatrix(A, b)

	if success {
		A = ARearranged
		b = bRearranged
	}

	D, L_plus_U := linearal.TransformMatrix(A)
	C, d := linearal.CalcC(D, L_plus_U, b)
	norm := linearal.MatrixInfNorm(C)

	if !success && norm >= 1 {
		response := map[string]interface{}{
			"error": !success,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}

	solution, iterations, errors := linearal.SimpleIteration(C, d, make([]float64, len(A)), tol, 1000)

	log.Println("Norm less than 1 proceed with solution")
	response := map[string]interface{}{
		"success":     success,
		"flag":        flag,
		"alreadyHas":  alreadyHas,
		"norm":        norm,
		"solution":    solution,
		"iterations":  iterations,
		"arearranged": ARearranged,
		"errors":      errors,
	}

	log.Println(solution)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	staticPath := os.Getenv("STATIC_PATH")
	log.Println(staticPath)

	fs := http.FileServer(http.Dir(staticPath))

	router := http.NewServeMux()
	router.HandleFunc("POST /solve", handleReq)
	router.Handle("GET /", fs)

	server := http.Server{
		Addr:    ":5176",
		Handler: corsMiddleware(router),
	}

	log.Printf("Starting server on %s\n", server.Addr)

	server.ListenAndServe()

}
