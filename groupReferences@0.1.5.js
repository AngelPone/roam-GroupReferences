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

// createButtons = (referenceList, container, Configs) => {
//   let buttonDiv = document.createElement('div');
//   buttonDiv.id = 'GroupReferenceButton';
//   for (let config of Configs) {
//     buttonEle = document.createElement('button');
//     buttonEle.className = 'bp3-button';
//     buttonEle.innerText = config['name'];
//     buttonEle.onclick = () => {
//       filterNotMatch(referenceList, config['rule']);
//       window.ReferencesGroup['State'] = config['rule'];
//     }
//     buttonDiv.insertAdjacentElement('afterbegin', buttonEle);
//   }
//   container.insertAdjacentElement("beforebegin", buttonDiv);
// }

const POPOVER_WRAPPER_CLASS = 'group-reference-popover-wrapper';

const createGroupButton = (Configs) => {
  const popoverWrapper = document.createElement("span");
  popoverWrapper.className = `bp3-popover-wrapper ${POPOVER_WRAPPER_CLASS}`;

  const popoverTarget = document.createElement("span");
  popoverTarget.className = "bp3-popover-target";
  popoverWrapper.appendChild(popoverTarget);

  const popoverButton = document.createElement("span");
  popoverButton.className = "bp3-button bp3-minimal bp3-small";
  popoverButton.tabIndex = 0;

  const popoverIcon = document.createElement("span");
  popoverIcon.className = `bp3-icon bp3-icon-layers`;
  popoverButton.appendChild(popoverIcon);
  popoverTarget.appendChild(popoverButton);

  // Overlay Content
  const popoverOverlay = document.createElement("div");
  popoverOverlay.className = "bp3-overlay bp3-overlay-inline";
  popoverWrapper.appendChild(popoverOverlay);

  const transitionContainer = document.createElement("div");
  transitionContainer.className =
    "bp3-transition-container bp3-popover-enter-done";
  transitionContainer.style.position = "absolute";
  transitionContainer.style.willChange = "transform";
  transitionContainer.style.top = "0";
  transitionContainer.style.left = "0";

  const popover = document.createElement("div");
  popover.className = "bp3-popover";
  popover.style.transformOrigin = "162px top";
  transitionContainer.appendChild(popover);

  const popoverContent = document.createElement('div');
  popoverContent.className = 'bp3-popover-content';
  popover.appendChild(popoverContent);

  const menuUl = document.createElement('ul');
  menuUl.className = 'bp3-menu';
  popoverContent.appendChild(menuUl);

  let selectedMenuItem;
  const createMenuItem = (text, callback) => {
    const liItem = document.createElement('li');
    const aMenuItem = document.createElement('a');
    aMenuItem.className = 'bp3-menu-item bp3-popover-dismiss';
    liItem.appendChild(aMenuItem);

    const menuItemText = document.createElement("div");
    menuItemText.className = "bp3-text-overflow-ellipsis bp3-fill";
    menuItemText.innerText = text;
    aMenuItem.appendChild(menuItemText);
    menuUl.appendChild(liItem);
    aMenuItem.onclick = (e) => {
      callback();
      aMenuItem.style.fontWeight = "600";
      if (selectedMenuItem) {
        selectedMenuItem.style.fontWeight = null;
      }
      selectedMenuItem = aMenuItem;
      e.stopImmediatePropagation();
      e.preventDefault();
    };
    aMenuItem.onmousedown = (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
    };
  }

  Configs.map((x)=>{
    createMenuItem(x['name'], () => {
      const referenceList = getReference()[0];
      filterNotMatch(referenceList, x['rule']);
      window.ReferencesGroup['State'] = x['rule'];
    })
  })

  let popoverOpen = false;

  const closePopover = () => {
    popoverOverlay.className = "bp3-overlay bp3-overlay-inline";
    popoverOverlay.removeChild(transitionContainer);
    document.removeEventListener("click", documentEventListener);
    popoverOpen = false;
  };

  const documentEventListener = (e) => {
    if (
      (!e.target || !popoverOverlay.contains(e.target)) &&
      popoverOpen
    ) {
      closePopover();
    }
  };

  popoverButton.onclick = (e) => {
    if (!popoverOpen) {
      transitionContainer.style.transform = `translate3d(${
        popoverButton.offsetLeft <= 180
          ? popoverButton.offsetLeft
          : popoverButton.offsetLeft - 180
      }px, ${popoverButton.offsetTop + 24}px, 0px)`;
      popoverOverlay.className =
        "bp3-overlay bp3-overlay-open bp3-overlay-inline";
      popoverOverlay.appendChild(transitionContainer);
      e.stopImmediatePropagation();
      e.preventDefault();
      document.addEventListener("click", documentEventListener);
      popoverOpen = true;
    } else {
      closePopover();
    }
  }
  return popoverWrapper;
}

const pageCallback = (mutationList, observer) => {
  const button = document.getElementsByClassName('group-reference-popover-wrapper');
  if (button.length >= 1){
    return;
  }
  const insertContainer = document.getElementsByClassName('rm-reference-container dont-focus-block')[0];
  
  if (insertContainer === undefined){
    return;
  }
  const referenceContainer = document.getElementsByClassName('refs-by-page-view')[0];
  if (referenceContainer === undefined){
    return;
  }
  const buttonEle = createGroupButton(window.ReferencesGroup['Config']);
  insertContainer.insertAdjacentElement('beforebegin', buttonEle);
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
window.ReferencesGroup['Config'] = getConfig('roam/js/GroupReferences');
window.ReferencesGroup['State'] = '';
const mutationConfig = {childList: true};

// const insertContainer = document.getElementsByClassName('rm-mentions refs-by-page-view')[0];
// if (insertContainer != undefined){
//   referenceList = getReference();
//   createButtons(referenceList[0], insertContainer, window.ReferencesGroup['Config']);
//   const targetNode = document.getElementsByClassName('refs-by-page-view')[0];
//   window.ReferencesGroup['observer'] = new MutationObserver(callBack);
//   window.ReferencesGroup['observer'].observe(targetNode, mutationConfig);
// }

const pagemutationConfig = {subtree: true, childList: true};
const pageTitleNode = document.getElementById("app");
const observer = new MutationObserver(pageCallback);
observer.observe(pageTitleNode, pagemutationConfig);
})();
