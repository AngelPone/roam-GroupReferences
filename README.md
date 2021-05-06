# roam-GroupReferences

Group Linked Reference names of page.

## Usage

```javascript
var s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/gh/AngelPone/roam-GroupReferences@main/groupReferences.js";
s.id = "GroupReference";
s.async = false;
s.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(s);
```

## Config

1. Create a page named `roam/js/ReferencesGroup`
2. add Category and corresponding regex rule
    
	```
	- Source
		- ^Source
	- Paper
		- ^@
	```
