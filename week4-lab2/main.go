package main

import (
	"fmt"
)

func main() {

	var age int = 20

	email := "viboonmongkhon_n@su.ac.th"

	gpa := 2.50

	firstname, lastname := "nattawat", "viboonmongkhon"

	fmt.Printf("Name%s %s, age %d, email %s, gpa %.2f\n", firstname, lastname, age, email, gpa)
}
