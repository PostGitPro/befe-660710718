// main.go
package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Student struct
type Shoes struct {
	Shoe_ID    string `json:"shoe_id"`
	Brand_Name string `json:"brand_name"`
	Price      int    `json:"price"`
	Quantity   int    `json:"quantity"`
}

// In-memory database (ในโปรเจคจริงใช้ database)
var shoes = []Shoes{
	{Shoe_ID: "1", Brand_Name: "Nike Air Jordan", Price: 35519, Quantity: 2},
	{Shoe_ID: "2", Brand_Name: "Adidas ", Price: 10623, Quantity: 5},
}

func getShoes(c *gin.Context) {

	Shoes_ID_Query := c.Query("shoe_id")

	if Shoes_ID_Query != "" {

		var filtered []Shoes
		for _, shoe := range shoes {
			if fmt.Sprint(shoe.Shoe_ID) == Shoes_ID_Query {
				filtered = append(filtered, shoe)
			}
		}
		c.JSON(http.StatusOK, filtered)
		return
	}

	c.JSON(http.StatusOK, shoes)
}

func main() {
	r := gin.Default()

	r.GET("/shoes", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "shoe"})
	})
	api := r.Group("/api/v1")
	{
		api.GET("/shoes", getShoes)
	}

	r.Run(":8080")
}
