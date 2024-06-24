package utils

import (
	"fmt"
	"strings"
)

func FormatNodeName(nodeName string) string {
	return fmt.Sprintf("%s%s", strings.ToUpper(string(nodeName[0])), nodeName[1:])
}
