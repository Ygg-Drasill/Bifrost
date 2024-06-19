package transformer

import (
	. "Bifrost/models"
	"Bifrost/utils"
	"fmt"
	"os"
	"strings"
)

type YggdrasillTransformer struct {
	nodes []Node
	edges []Edge

	targetFilePath string
}

func NewYggdrasillTransformer(targetPath string) *YggdrasillTransformer {
	return &YggdrasillTransformer{
		nodes:          make([]Node, 0),
		edges:          make([]Edge, 0),
		targetFilePath: targetPath,
	}
}

func (yt *YggdrasillTransformer) UpdateNodes(newNodes []Node) {
	yt.nodes = newNodes
	yt.ParseToFile()
}

func (yt *YggdrasillTransformer) UpdateEdges(newEdges []Edge) {
	yt.edges = newEdges
	yt.ParseToFile()
}

func (yt *YggdrasillTransformer) ParseToFile() {
	file, err := os.Create(yt.targetFilePath)
	utils.HandleError(err)
	yt.generateCode(file)
	if err != nil {
		panic(err)
	}
	utils.HandleError(file.Close())
}

func (yt *YggdrasillTransformer) generateCode(file *os.File) {
	for _, node := range yt.nodes {
		line := yt.nodeToYggrasill(node)
		_, err := file.WriteString(line)
		utils.HandleError(err)
	}

	for _, edge := range yt.edges {
		line := yt.edgeToYggdrasill(edge)
		_, err := file.WriteString(line)
		utils.HandleError(err)
	}
}

func (yt *YggdrasillTransformer) nodeToYggrasill(node Node) string {
	var nodeName = strings.Join([]string{node.NodeType, node.Id}, "")
	return fmt.Sprintf("%s : %s\n", nodeName, node.NodeType)
}

func (yt *YggdrasillTransformer) edgeToYggdrasill(edge Edge) string {
	var nodeA Node = *NodeSlice(yt.nodes).findNodeWithId(edge.Source)
	var nodeB Node = *NodeSlice(yt.nodes).findNodeWithId(edge.Target)
	var nodeALabel = fmt.Sprintf("%s%s", nodeA.NodeType, nodeA.Id)
	var nodeBLabel = fmt.Sprintf("%s%s", nodeB.NodeType, nodeB.Id)
	return fmt.Sprintf("%s -> %s;\n", nodeALabel, nodeBLabel)
}

type NodeSlice []Node

func (nodes NodeSlice) findNodeWithId(id string) *Node {
	for i, n := range nodes {
		if n.Id == id {
			return &nodes[i]
		}
	}

	return nil
}
