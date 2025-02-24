package main

import (
	"fmt"

	"github.com/nerfthisdev/cm-lab-1/internal/linearal"
)

func main() {

	A := [][]float64{
		{3.0, 2.0, 10.0, 1.0},
		{1.0, 2.0, 1.0, 12.0},
		{15.0, 1.0, 2.0, 3.0},
		{1.0, 20.0, 1.0, 2.0},
	}

	b := []float64{16.0, 16.0, 21.0, 24.0}

	var success bool
	var flag bool
	var alreadyHas bool

	A, b, success, flag, alreadyHas = linearal.RearrangeMatrix(A, b)

	linearal.CheckVerbose(A)

	fmt.Println(A[1])
	fmt.Println(b[1])

	if !success {
		fmt.Println("Не удалось достичь диагонального преобладания!")
		return
	} else {
		fmt.Printf("Удалось достичь диагонального преобладания, строгое выполнение неравенства: %t, УЖЕ БЫЛА: %t \n", flag, alreadyHas)

	}

	// Вычисление B = D^{-1} * (D - A) = I - D^{-1}A

	D, L_plus_U := linearal.TransformMatrix(A)
	B, c := linearal.CalcB(D, L_plus_U, b)
	norm := linearal.MatrixInfNorm(B)
	fmt.Printf("∞-норма матрицы B: %.4f\n", norm)

	x0 := make([]float64, len(A))

	tol := 1e-6

	solution, iterations, errors := linearal.SimpleIteration(B, c, x0, tol, 1000)

	fmt.Println("Решение:", solution)
	fmt.Println("Количество итераций:", iterations)
	fmt.Println("Вектор погрешностей:", errors[:10], "...")
}
