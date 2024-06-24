package models

type Node struct {
	Id       string `json:"id"`
	NodeType string `json:"nodeType"`
}

type Edge struct {
	SourceId  string `json:"sourceId"`
	SourceVar string `json:"sourceVar"`
	TargetId  string `json:"targetId"`
	TargetVar string `json:"targetVar"`
}
