package main

import (
	"fmt"

	"github.com/nerfthisdev/cm-lab-1/internal/linearal"
)

func main() {

	A := [][]float64{
		{4, 1},
		{1, 3},
	}

	b := []float64{3, 2}

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

	D, L_plus_U := linearal.TransformMatrix(A)

	fmt.Println(L_plus_U)

	C, d := linearal.CalcC(D, L_plus_U, b)
	norm := linearal.MatrixInfNorm(C)
	fmt.Printf("∞-норма матрицы B: %.4f\n", norm)

	x0 := make([]float64, len(A))

	tol := 1e-6

	solution, iterations, errors := linearal.SimpleIteration(C, d, x0, tol, 1000)

	fmt.Println("Решение:", solution)
	fmt.Println("Количество итераций:", iterations)
	fmt.Println("Вектор погрешностей:", errors[:10], "...")
}
