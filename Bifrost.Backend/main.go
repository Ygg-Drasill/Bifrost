package main

import (
	"Bifrost/models"
	"Bifrost/transformer"
	"Bifrost/utils"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func main() {
	ydt := transformer.NewYggdrasillTransformer("./out.ygl")

	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	router.Use(cors.New(config))

	nodesHandler := func(context *gin.Context) {
		var nodes []models.Node
		utils.HandleError(context.BindJSON(&nodes))
		fmt.Println(nodes)
		ydt.UpdateNodes(nodes)
		context.JSON(http.StatusOK, gin.H{
			"message": "nodes updated",
		})
	}
	edgesHandler := func(context *gin.Context) {
		var edges []models.Edge
		utils.HandleError(context.BindJSON(&edges))
		fmt.Println(edges)
		ydt.UpdateEdges(edges)
		context.JSON(http.StatusOK, gin.H{
			"message": "edges updated",
		})
	}

	router.POST("/update/nodes", nodesHandler)
	router.POST("/update/edges", edgesHandler)

	err := router.Run(":9000")
	if err != nil {
		log.Fatal(err)
	}
}
