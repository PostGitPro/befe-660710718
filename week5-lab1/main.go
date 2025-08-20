package main

import (
	"github.com/gin-gonic/gin"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func main() {
	r := gin.Default()

	// Define a simple GET endpoint
	r.GET("/users", func(c *gin.Context) {
		users := []User{{ID: "1", Name: "Nattawat"}}
		c.JSON(200, users) // Respond with a JSON array of users
	})

	// Start the server on port 8080
	r.Run(":8080")
}
