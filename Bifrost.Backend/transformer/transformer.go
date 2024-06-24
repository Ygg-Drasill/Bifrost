package transformer

import (
	"bifrost/models"
	"bifrost/utils"
	"bytes"
	"fmt"
	"github.com/Ygg-Drasill/Sleipnir/pkg/compiler"
	"os"
	"strings"
)

type YggdrasillTransformer struct {
	nodes          []models.Node
	edges          []models.Edge
	yglBuffer      bytes.Buffer
	targetBuffer   bytes.Buffer
	targetFilePath string
}

func NewYggdrasillTransformer(targetPath string) *YggdrasillTransformer {
	return &YggdrasillTransformer{
		nodes:          make([]models.Node, 0),
		edges:          make([]models.Edge, 0),
		targetFilePath: targetPath,
	}
}

func (yt *YggdrasillTransformer) UpdateNodes(newNodes []models.Node) {
	yt.nodes = newNodes
}

func (yt *YggdrasillTransformer) UpdateEdges(newEdges []models.Edge) {
	yt.edges = newEdges
}

func (yt *YggdrasillTransformer) ParseToFile() {
	if len(yt.edges) == 0 && len(yt.nodes) == 0 {
		fmt.Println("No nodes in transformer")
		return
	}

	file, err := os.Create(yt.targetFilePath)
	utils.HandleError(err)
	yt.generateCodeFile(file)
	if err != nil {
		panic(err)
	}
	utils.HandleError(file.Close())
}

func (yt *YggdrasillTransformer) Compile() {
	if yt.targetBuffer.Len() == 0 {
		fmt.Println("Ygl buffer is empty")
		return
	}
	c := compiler.NewFromString(yt.yglBuffer.String())
	err := c.Compile()
	if err != nil {
		fmt.Println(err.Error())
	}
	c.ConvertWat2Wasm("out.wasm")
}

func (yt *YggdrasillTransformer) generateCodeFile(file *os.File) {
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

func (yt *YggdrasillTransformer) nodeToYggrasill(node models.Node) string {
	var nodeName = strings.Join([]string{node.NodeType, node.Id}, "")
	if node.NodeType == "declare" {
		return fmt.Sprintf("node %s {%s};", utils.FormatNodeName(nodeName))
	}
	return fmt.Sprintf("node %s : %s;\n", utils.FormatNodeName(nodeName), node.NodeType)
}

func (yt *YggdrasillTransformer) edgeToYggdrasill(edge models.Edge) string {
	var nodeA = *NodeSlice(yt.nodes).findNodeWithId(edge.SourceId)
	var nodeB = *NodeSlice(yt.nodes).findNodeWithId(edge.TargetId)
	var nodeALabel = fmt.Sprintf("%s%s.%s", nodeA.NodeType, nodeA.Id, edge.SourceVar)
	var nodeBLabel = fmt.Sprintf("%s%s.%s", nodeB.NodeType, nodeB.Id, edge.TargetVar)
	return fmt.Sprintf("%s -> %s;\n", nodeALabel, nodeBLabel)
}

type NodeSlice []models.Node

func (nodes NodeSlice) findNodeWithId(id string) *models.Node {
	for i, n := range nodes {
		if n.Id == id {
			return &nodes[i]
		}
	}

	return nil
}
