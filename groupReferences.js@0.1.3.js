(() => {
  getReference = () => {
    const containers = document.getElementsByClassName('refs-by-page-view');
    const referenceLists = [];
    for (let i = 0; i < containers.length; i++) {
      const referenceList = containers[i].getElementsByClassName('rm-ref-page-view');
      referenceLists.push([]);
      for (let j = 0; j < referenceList.length; j++) {
        referenceLists[i].push({
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
    Config.push({
      "name": 'ALL',
      "rule": '',
    })
    return Config;
  }
  
  filterNotMatch = (referenceList, rule) => {
    referenceList.map((x) => {
      if (x['title'].match(rule)) {
        x['node'].style.display = ''
      }else{
        x['node'].style.display = 'None'
      }
    })
  }
  
  createButtons = (referenceList, container, Configs) => {
    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'GroupReferenceButton';
    for (let config of Configs) {
      buttonEle = document.createElement('button');
      buttonEle.className = 'bp3-button';
      buttonEle.innerText = config['name'];
      buttonEle.onclick = () => {
        filterNotMatch(referenceList, config['rule']);
        window.ReferencesGroup['State'] = config['rule'];
      }
      buttonDiv.insertAdjacentElement('afterbegin', buttonEle);
    }
    container.insertAdjacentElement("beforebegin", buttonDiv);
  }
  
  const pageCallback = (mutationList, observer) => {
    const button = document.getElementById('GroupReferenceButton');
    if (button !== null){
      return;
    }
    const insertContainer = document.getElementsByClassName('rm-mentions refs-by-page-view')[0];
    if (insertContainer === undefined){
      return;
    }
    referenceList = getReference();
    createButtons(referenceList[0], insertContainer, window.ReferencesGroup['Config']);
    const targetNode = document.getElementsByClassName('refs-by-page-view')[0];
    window.ReferencesGroup['observer'] = new MutationObserver(callBack);
    window.ReferencesGroup['observer'].observe(targetNode, mutationConfig);
  }
  const callBack = (mutationsList, observer) => {
    for(let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            referenceList = getReference();
            filterNotMatch(referenceList[0], window.ReferencesGroup['State'])
          }
        }
  }
  
  window.ReferencesGroup = {};
  window.ReferencesGroup['Config'] = getConfig('roam/js/ReferencesGroup');
  window.ReferencesGroup['State'] = '';
  const mutationConfig = {childList: true};

  const pagemutationConfig = {subtree: true, childList: true};
  let pageTitleNode = document.getElementById("app");
  const observer = new MutationObserver(pageCallback);
  observer.observe(pageTitleNode, pagemutationConfig);
})();
  