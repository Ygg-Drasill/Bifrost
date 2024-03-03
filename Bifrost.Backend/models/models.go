package models

type Node struct {
	Id       string `json:"id"`
	NodeType string `json:"nodeType"`
}

type Edge struct {
	Source string `json:"source"`
	Target string `json:"target"`
}
