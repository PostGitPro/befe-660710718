package main

import (
	"github.com/gin-gonic/gin"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func getUsers(c *gin.Context) {
	users := []User{{ID: "1", Name: "Nattawat"}}
	c.JSON(200, users) // Respond with a JSON array of users
}

func main() {
	r := gin.Default()

	// Define a simple GET endpoint
	r.GET("/users", getUsers)

	// Start the server on port 8080
	r.Run(":8080")
}
