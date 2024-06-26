package main

import (
	"bifrost/models"
	"bifrost/transformer"
	"bifrost/utils"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
)

type updateRequest struct {
	Nodes []models.Node `json:"nodes"`
	Edges []models.Edge `json:"edges"`
}

func main() {
	targetPath := os.Args[1]

	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	router.Use(cors.New(config))

	updateHandler := func(context *gin.Context) {
		var request updateRequest
		utils.HandleError(context.ShouldBindJSON(&request))
		fmt.Println(request.Nodes, request.Edges)
		ydt := transformer.NewYggdrasillTransformer(targetPath, request.Nodes, request.Edges)
		ydt.ParseToFile()
		ydt.Compile()
		context.JSON(http.StatusOK, gin.H{
			"message": "nodes updated",
		})
	}

	router.POST("/update", updateHandler)

	err := router.Run(":9000")
	if err != nil {
		log.Fatal(err)
	}
}
