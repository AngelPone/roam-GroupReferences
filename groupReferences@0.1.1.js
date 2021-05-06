(() => {
	getReference = () => {
		const containers = document.getElementsByClassName('refs-by-page-view');
		const pages = document.getElementsByClassName('rm-title-display')
		const referenceLists = [];
		for (let i = 0; i < containers.length; i++) {
			const referenceList = containers[i].getElementsByClassName('rm-ref-page-view');
			referenceLists.push({
				'pageTitle': pages[i].innerText,
				'references': []
			});
			for (let j = 0; j < referenceList.length; j++) {
				referenceLists[i]['references'].push({
					'title': referenceList[j].getElementsByClassName('rm-ref-page-view-title')[0].innerText,
					'node': referenceList[j]
				});
			}
		}
		return referenceLists;
	}

	getConfig = (configPageTitle) => {
		configQuery = window.roamAlphaAPI.q(`[ :find (pull ?configPage [:block/children {:block/children [:block/children :block/string {:block/children [:block/string]}]}]) :where [?configPage :node/title "${configPageTitle}"] ]`)[0][0]['children'];
		const Config = [];
		for (let i = 0; i < configQuery.length; i++) {
			Config.push({
				"name": configQuery[i]['string'],
				"rule": configQuery[i]['children'][0]['string']
			})
		}
		return Config;
	}

	createButton = (container, content, handleClick) => {
		buttonEle = document.createElement('button');
		buttonEle.className = 'bp3-button';
		buttonEle.innerText = content;
		buttonEle.onclick = handleClick;
		container.insertAdjacentElement('beforeBegin', buttonEle)
	}


	filterNotMatch = (referenceList, rule) => {
		const references = referenceList['references'];
		references.map((x) => {
			if (x['title'].match(rule)) {
				x['node'].style.display = ''
			}else{
				x['node'].style.display = 'None'
			}
		})
	}

	window.ReferencesGroup = {};
	window.ReferencesGroup['Config'] = getConfig('roam/js/ReferencesGroup');
	window.ReferencesGroup['State'] = '';
	const insertContainer = document.getElementsByClassName('rm-mentions refs-by-page-view')[0];
	let referenceList = getReference();
	for (let config of window.ReferencesGroup['Config']) {
		createButton(insertContainer, config['name'], (event) => {
			filterNotMatch(referenceList[0], config['rule']);
			window.ReferencesGroup['State'] = config['rule'];
		});
    }
    createButton(insertContainer, 'All', (event) => {
			filterNotMatch(referenceList[0], '.');
			window.ReferencesGroup['State'] = '';
		});

	const targetNode = document.getElementsByClassName('refs-by-page-view')[0];
	const mutationConfig = {attributes: true, childList: true, subtree: true };
	
	const callBack = (mutationsList, observer) => {
		for(let mutation of mutationsList) {
        	if (mutation.type === 'childList') {
        		referenceList = getReference();
        		filterNotMatch(referenceList[0], window.ReferencesGroup['State'])
        	}
        }
	}
	const observer = new MutationObserver(callBack);

	observer.observe(targetNode, mutationConfig);

})();



