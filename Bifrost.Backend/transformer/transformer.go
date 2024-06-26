package transformer

import (
	"bifrost/models"
	"bifrost/utils"
	"bytes"
	"fmt"
	"github.com/Ygg-Drasill/Sleipnir/pkg/compiler"
	"strings"
)

type YggdrasillTransformer struct {
	nodes          []models.Node
	edges          []models.Edge
	yglBuffer      *bytes.Buffer
	targetBuffer   bytes.Buffer
	targetFilePath string
}

func NewYggdrasillTransformer(targetPath string, nodes []models.Node, edges []models.Edge) *YggdrasillTransformer {
	return &YggdrasillTransformer{
		nodes:          nodes,
		edges:          edges,
		targetFilePath: targetPath,
		yglBuffer:      bytes.NewBuffer(make([]byte, 0)),
	}
}

func (yt *YggdrasillTransformer) ParseToFile() {
	if len(yt.edges) == 0 && len(yt.nodes) == 0 {
		fmt.Println("No nodes in transformer")
		return
	}

	yt.generateCodeFile()
}

func (yt *YggdrasillTransformer) Compile() {
	if len(yt.edges) == 0 || len(yt.nodes) == 0 {
		return
	}
	if yt.yglBuffer.Len() == 0 {
		fmt.Println("Ygl buffer is empty")
		return
	}
	c := compiler.NewFromString(yt.yglBuffer.String())
	err := c.Compile()
	//c.WriteWatFile("o.wat")
	if err != nil {
		fmt.Println(err.Error())
	}
	c.ConvertWat2Wasm(fmt.Sprintf("%s\\o.wasm", yt.targetFilePath))
	yt.yglBuffer.Reset()
	yt.targetBuffer.Reset()
	fmt.Println("compiled successfully!")
}

func (yt *YggdrasillTransformer) generateCodeFile() {
	for _, node := range yt.nodes {
		line := yt.nodeToYggrasill(node)
		yt.yglBuffer.WriteString(line)
	}

	for _, edge := range yt.edges {
		line := yt.edgeToYggdrasill(edge)
		yt.yglBuffer.WriteString(line)
	}
}

func (yt *YggdrasillTransformer) nodeToYggrasill(node models.Node) string {
	var nodeName = strings.Join([]string{node.NodeType, node.Id}, "")
	if node.NodeType == "integer" {
		if data, ok := node.Data.(map[string]interface{}); ok {
			literal := data["value"].(float64)
			return fmt.Sprintf("node %s { out { int value = %d; } }\n", utils.FormatNodeName(nodeName), int(literal))
		}
		fmt.Println("failed to convert node data to integer")
		return ""
	}
	return fmt.Sprintf("node %s : %s;\n", utils.FormatNodeName(nodeName), utils.FormatNodeName(node.NodeType))
}

func (yt *YggdrasillTransformer) edgeToYggdrasill(edge models.Edge) string {
	var nodeA = *NodeSlice(yt.nodes).findNodeWithId(edge.SourceId)
	var nodeB = *NodeSlice(yt.nodes).findNodeWithId(edge.TargetId)
	var nodeALabel = fmt.Sprintf("%s%s.out.%s", utils.FormatNodeName(nodeA.NodeType), nodeA.Id, edge.SourceVar)
	var nodeBLabel = fmt.Sprintf("%s%s.in.%s", utils.FormatNodeName(nodeB.NodeType), nodeB.Id, edge.TargetVar)
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
