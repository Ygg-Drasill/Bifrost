package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func main() {

	fmt.Println("Server listening on port 9000")
	nodesHandler := func(w http.ResponseWriter, req *http.Request) {
		io.WriteString(w, "Nodes\n")
	}
	edgesHandler := func(w http.ResponseWriter, req *http.Request) {
		io.WriteString(w, "Edges\n")
	}

	http.HandleFunc("/update/nodes", nodesHandler)
	http.HandleFunc("/update/edges", edgesHandler)
	log.Fatal(http.ListenAndServe(":9000", nil))
}
