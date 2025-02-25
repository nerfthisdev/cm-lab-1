package linearal

import (
	"fmt"
	"math"
)

func RearrangeMatrix(mat [][]float64, b []float64) ([][]float64, []float64, bool, bool, bool) {
	n := len(mat)
	flag := false
	alreadyHas := false
	rowTrueCounter := 0
	var rowMax float64
	for i := 0; i < n; i++ {

		rowSum := 0.0
		rowMax = math.Inf(-1)
		indexMax := 0

		for j := 0; j < n; j++ {
			x := math.Abs(mat[i][j])
			rowSum += x
			if x > rowMax {
				rowMax = x
				indexMax = j
			}
		}

		if rowMax >= rowSum-rowMax {

			if rowMax > rowSum-rowMax {
				flag = true
			}

			if mat[indexMax][indexMax] != rowMax {
				mat[i], mat[indexMax] = mat[indexMax], mat[i]
				b[i], b[indexMax] = b[indexMax], b[i]
			} else {
				rowTrueCounter++
				alreadyHas = n == rowTrueCounter
			}

		} else {
			return mat, b, false, flag, alreadyHas
		}

	}

	return mat, b, true, flag, alreadyHas
}

func CheckVerbose(mat [][]float64) {
	n := len(mat)
	var rowMax float64
	for i := 0; i < n; i++ {

		rowSum := 0.0
		rowMax = math.Inf(-1)
		indexMax := 0

		for j := 0; j < n; j++ {
			x := math.Abs(mat[i][j])
			rowSum += x
			if x > rowMax {
				rowMax = x
				indexMax = j
			}
		}

		fmt.Printf("Строка: %d, Макс: %f, ИндексМакс: %d \n", i, rowMax, indexMax)
	}

}

func MatrixInfNorm(mat [][]float64) float64 {
	maxSum := 0.0
	for _, row := range mat {
		sum := 0.0
		for _, val := range row {
			sum += math.Abs(val)
		}
		if sum > maxSum {
			maxSum = sum
		}
	}
	return maxSum
}

// diag - диагональ матрицы, L_plus_U элементы матрицы кроме диагонали
func TransformMatrix(mat [][]float64) ([][]float64, [][]float64) {

	n := len(mat)
	diag := make([][]float64, n)
	L_plus_U := make([][]float64, n)
	for i := 0; i < n; i++ {
		diag[i] = make([]float64, n)
		L_plus_U[i] = make([]float64, n)
		diag[i][i] = mat[i][i]
		for j := 0; j < n; j++ {
			if i != j {
				L_plus_U[i][j] = mat[i][j]
			}
		}
	}

	return diag, L_plus_U
}

// C - Матрица преобразования, D - Вектор правых частей
func CalcC(C [][]float64, L_plus_U [][]float64, b []float64) ([][]float64, []float64) {
	n := len(b)
	С := make([][]float64, n)
	D := make([]float64, n)
	for i := 0; i < n; i++ {
		С[i] = make([]float64, n)
		invD := 1.0 / C[i][i]
		D[i] = invD * b[i]
		for j := 0; j < n; j++ {
			С[i][j] = -invD * L_plus_U[i][j]
		}
	}
	return С, D
}

func SimpleIteration(B [][]float64, c []float64, x0 []float64, tol float64, maxIter int) ([]float64, int, []float64) {
	n := len(x0)
	x := make([]float64, n)
	copy(x, x0)
	errors := make([]float64, 0)
	iter := 0

	for ; iter < maxIter; iter++ {
		xNew := make([]float64, n)
		for i := 0; i < n; i++ {
			xNew[i] = c[i]
			for j := 0; j < n; j++ {
				xNew[i] += B[i][j] * x[j]
			}
		}
		currentError := 0.0
		for i := 0; i < n; i++ {
			currentError += math.Pow(xNew[i]-x[i], 2)
		}
		currentError = math.Sqrt(currentError)
		errors = append(errors, currentError)

		if currentError < tol {
			break
		}
		copy(x, xNew)
	}

	return x, iter + 1, errors
}
