# roam-GroupReferences

Group Linked Reference of page based on pre-configured Regex rule.

## Usage

```javascript
var s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/gh/AngelPone/roam-GroupReferences@main/groupReferences@0.1.5.js";
s.id = "GroupReference";
s.async = false;
s.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(s);
```

## Config

1. Create a config page named `roam/js/GroupReferences`
2. add Category and corresponding regex rule
   
	```
	- Source
	  - ^Source
	- Paper
	  - ^@
	- DNP
	  - (January|February|March|April|May|June|July|August|September|October|November|December)\d{1,2}(th|rd|st), 202\d
	```

where `DNP` means `Daily Notes Page`

check this video for a small example: https://cln.sh/Y7Za3u

