const body = document.querySelector('body');
const moveTarget = document.querySelector('.move_menu');

let isClicked = false;
let targetMenu = undefined;
let originMenu = undefined;

function mousedown(event) {
    const mouseMainBtn = 0;
    if(event.button !== mouseMainBtn) {
        return
    }
    isClicked = true;

    const targetMoveMenu = event.target.closest('li');
    if(targetMoveMenu === null) {
        return
    }
    originMenu = targetMoveMenu ;
    targetMenu = targetMoveMenu.cloneNode(true);
    
    originMenu.classList.add('on');

    const { pageX, pageY } = event;
    
    moveTarget.appendChild(targetMenu);
    
    moveTarget.style.left = `${pageX - moveTarget.offsetWidth / 2}px`;
    moveTarget.style.top = `${pageY - moveTarget.offsetHeight / 2}px`;
}

function mousemove(event) {
    if(!isClicked || !targetMenu) {
        return
    }
    
    const { pageX, pageY } = event;

    moveTarget.hidden = true;
    const eleBelow = document.elementFromPoint(pageX, pageY);
    const menuItem = eleBelow.closest('li');
    const menuBox = eleBelow.closest('.menu_box');
    moveTarget.hidden = false;

    moveTarget.style.left = `${pageX - moveTarget.offsetWidth / 2}px`;
    moveTarget.style.top = `${pageY - moveTarget.offsetHeight / 2}px`;

    if(!menuItem) {
        if(menuBox) {
            const menuBoxUl = menuBox.querySelector('ul');
            const {top} = menuBoxUl.getBoundingClientRect();
            if(top >= pageY) {
                menuBoxUl.prepend(originMenu)
            } else {
                menuBoxUl.appendChild(originMenu);
            }
        }
        return
    }
    
    if (isBefore(originMenu, menuItem)) {
        menuItem.parentNode.insertBefore(originMenu, menuItem);
    } else if (menuItem.parentNode) {
        menuItem.parentNode.insertBefore(originMenu, menuItem.nextSibling);
    }
}

function isBefore(originItem, targetItem) {
    if (targetItem.parentNode === originItem.parentNode) {
        for (let cur = originItem.previousSibling; cur; cur = cur.previousSibling) {
            if (cur === targetItem) {
                return true;
            }
        }
    }
    return false;
}

function mouseup() {
    if(!isClicked) {
        return
    }

    isClicked = false;
    if(originMenu){
        originMenu.classList.remove('on');
    }
    if(targetMenu) {
        targetMenu.remove();
    }

    originMenu = undefined;
    targetMenu = undefined;
}

function mouseleave() {
    if(!isClicked){
        return
    }
    
    mouseup();
}

body.addEventListener('mousemove', mousemove);
body.addEventListener('mousedown', mousedown);
body.addEventListener('mouseup', mouseup);
body.addEventListener('mouseleave', mouseleave);
