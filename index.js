
/** @jsx hs */

/**
 * Hyperscript function (JSX Pragma)
 * Converts JSX syntax into Virtual DOM (VNode) objects.
 * 
 * @param {string|function} nodeName - The tag name (e.g., 'div') or component function.
 * @param {object} attributes - Props/attributes (e.g., { id: 'app', class: 'foo' }).
 * @param {...any} args - Children elements.
 * @returns {object} A VNode object representing the element.
 */
export function hs(nodeName, attributes, ...args) {
    // Flatten children args into a single array
    let children = args.length ? [].concat(...args) : [];

    // If nodeName is a function, it's a Functional Component.
    // Call it with attributes (props) and children.
    if(typeof nodeName === 'function'){
        return nodeName(attributes,children)
    }

    // Process children: filter nulls and convert strings/numbers to text nodes
    children = children.map(child => {
        if(child === null || child === undefined) return null; // Drop invalid children
        if(typeof child === 'string' || typeof child === 'number'){
            return {nodeName: '#text', value:String(child)}
        }
        return child
    }).filter(child => child !== null); // Remove nulls from the tree

    // Return the Virtual Node
    return { nodeName, attributes, children };
}

/**
 * Global Event Delegation
 * Listens for clicks on the document and propagates them to the correct handler.
 * This avoids attaching event listeners to every single DOM node.
 */
document.addEventListener("click", (event) => {
    let target = event.target;
    // Bubble up from the target to find an element with a click handler
    while (target && target !== document) {
        if (target._events && target._events.click) {
            target._events.click(event);
            return; // Stop propagation once handled
        }
        target = target.parentNode;
    }
});

export function render(vnode) {
    if(!vnode) return;
    if (vnode.nodeName === '#text') {
        let  n =  document.createTextNode(vnode.value);
        vnode.$el = n;
        return n;
    }
    let n = document.createElement(vnode.nodeName);
    vnode.$el = n;

    let a = vnode.attributes || {};
    // Object.keys(a).forEach( k => n.setAttribute(k, a[k]));
    //console.log(a)
    // adding an eventlistener "onClick" like React
    Object.keys(a).forEach((k) => {
        if (k.startsWith("on") && typeof a[k] === "function") {
            // It's an event handler like onClick
            const eventName = k.slice(2).toLowerCase();
            n._events = n._events || {};
            n._events[eventName] =  a[k];
            
        }else if(k.startsWith("st") ){
            const style = a[k]
            Object.assign(n.style,style)
        }else {
            n.setAttribute(k, a[k]);
        }
    });


    (vnode.children || []).forEach(c => n.appendChild(render(c)));

    return n;
}




/**
 * Patch Function (The Diffing Algorithm)
 * Compares old VNode vs new VNode and updates the DOM efficiently.
 * 
 * @param {HTMLElement} parent - The parent DOM element.
 * @param {object} oldVNode - The previous VNode.
 * @param {object} newVNode - The new VNode.
 */
function patch(parent, oldVNode, newVNode,index = null) {
    // 1. Create: If no old node, just render the new one
    if(!oldVNode){
        const newNode = render(newVNode)
        if(index != null  && parent.childNodes[index]){
            parent.insertBefore(newNode,parent.childNodes[i])
        }else{
            parent.appendChild(newNode);
        }
        return newNode
    }
    
    // 2. Remove: If no new node, remove the old one
    if(!newVNode){
        const removeNode  = oldVNode.$el;
        parent.removeChild(removeNode)
        return null;
    }
   
    // 3. Replace: If nodes are different types, replace entirely
    if (oldVNode.nodeName !==  newVNode.nodeName || (oldVNode.nodeName === "#text" && newVNode.value !== oldVNode.value)) {
        const $newNode = render(newVNode);
        parent.replaceChild($newNode,oldVNode.$el);
        return $newNode;
    }

    // 4. Update: Nodes are same type. Update existing DOM.
    if(oldVNode.nodeName === '#text'){
        oldVNode.$el.nodeValue = newVNode.value;
        newVNode.$el = oldVNode.$el;
        return newVNode.$el
    }
    
    const el = oldVNode.$el;
    newVNode.$el = el; // Transfer DOM reference

    // Diff Attributes
    const oldAttrs = oldVNode.attributes || {};
    const newAttrs = newVNode.attributes || {};
    
    // Remove old attributes not in new
    Object.keys(oldAttrs).forEach(key => {
        if (!(key in newAttrs)) {
            if (key.startsWith('on')) {
                 const eventName = key.slice(2).toLowerCase();
                 if(el._events) delete el._events[eventName];
            } else if (key === 'style') {
                el.style = '';
            } else {
                el.removeAttribute(key);
            }
        }
    });
    
    // Set/Update new attributes
    Object.keys(newAttrs).forEach(key => {
        if (oldAttrs[key] !== newAttrs[key]) {
             if (key.startsWith('on')) {
                 const eventName = key.slice(2).toLowerCase();
                 el._events = el._events || {};
                 el._events[eventName] = newAttrs[key];
             } else if (key === 'style') {
                 Object.assign(el.style, newAttrs[key]);
             } else if (key === 'value' || key === 'checked') {
                 el[key] = newAttrs[key];
             } else {
                 el.setAttribute(key, newAttrs[key]);
             }
        }
    });

    // 5. Recursively patch children
    patchChildren(el,oldVNode.children,newVNode.children);
}




/**
 * Patch Children (List Reconciliation)
 * Handles lists of children, supporting keyed updates for efficiency.
 * 
 * @param {HTMLElement} parent - The parent element.
 * @param {Array} oldChildren - List of old VNodes.
 * @param {Array} newChildren - List of new VNodes.
 */
export function patchChildren(parent, oldChildren, newChildren) {
    oldChildren = oldChildren || [];
    newChildren = newChildren || [];
    // Keyed Reconciliation Strategy:
    // 1. Map old keys to their VNodes for quick lookup.
    const oldKeysMap = {}
    oldChildren.forEach((child,index) => {
        const key = child.attributes && child.attributes.key;
        if(key !== undefined) {
            oldKeysMap[key] = {child,index}
        }
    })
 
    // 2. Iterate through new children and try to match with old ones
    for(let i = 0 ;i<newChildren.length;i++){
        const newChild = newChildren[i]
        const newKey = newChild.attributes && newChild.attributes.key;
       console.log(oldKeysMap)
        // If matched by key, reuse the old node
        if(newKey !== undefined && oldKeysMap[newKey]){
            const {child: oldChild} = oldKeysMap[newKey]
           if(oldChild == newChild){
            patch(parent,oldChild,newChild,i)
            // Reorder DOM if necessary
            if(oldChild.$el !== parent.childNodes[i]){
                parent.insertBefore(oldChild.$el , parent.childNodes[i])
                  //console.log(oldChildren[i],newChildren[i])
            }
        }
        }else{
            // No key match, fall back to index-based patching
           // console.log(oldChildren[i],newChildren[i])
            patch(parent, oldChildren[i], newChildren[i],i)
        }
    }

    // 3. Cleanup: Remove any extra old children
    if(oldChildren.length > newChildren.length){
        for(let i = newChildren.length; i < oldChildren.length;i++){
            if(oldChildren[i] && oldChildren[i].$el){
                parent.removeChild(oldChildren[i].$el)
            }
        }
    }
}

let hooks = [];
let hookIndex = 0;
export function useState(initialValue){
    let currentHookIndex = hookIndex;
    if(hooks[currentHookIndex] === undefined){
        hooks[currentHookIndex] = initialValue;
    }
    const setState = (newValue) => {
        hooks[currentHookIndex] = newValue;
        renderApp()
    }
    hookIndex++;
    
    return [hooks[currentHookIndex],setState]

}

let rootComponent = null;
let rootAttributes = null;
let rootArgs = null;

export function app(nodeName, attributes, ...args) {
    //let node = hs(nodeName, attributes, ...args);  

    rootComponent = nodeName;
    rootAttributes = attributes;
    rootArgs = args;
    renderApp()
}


let oldNode = undefined;

function renderApp(){
    hookIndex = 0;
    let node;
    if(typeof rootComponent === 'function'){
        node = rootComponent(rootAttributes,...rootArgs)
    }else {
        node = hs(rootComponent,rootAttributes,...rootArgs)
    }
    patch(document.body, oldNode, node);
     oldNode = node;
}


//useEffect Function :
let hookStates = []
let currentEffectHookIndex = 0
let pendingEffects = []
let cleanupEffects = []

function effectHook(callback,dependencies){
    const effectHookookIndex = currentEffectHookIndex;
    currentEffectHookIndex++;

    const prevHook = hookStates[effectHookookIndex];

    let hasChanged = true;
    if(prevHook && prevHook.dependencies && dependencies){
        hasChanged = dependencies.some((dep,i) => {
            return !Object.is(dep,prevHook.dependencies[i])
        })
    }else if(!prevHook){
        //first render
        hasChanged = true;
    }else{
        hasChanged = true;
    }
    //store the hook state data
    hookStates[effectHookookIndex] = {
        dependencies,
        cleanup:prevHook?.cleanup
    }
    if(hasChanged){
    pendingEffects.push({
        callback,
        effectHookookIndex,
        dependencies
    })
}

}
export function renderEffect(){
    currentEffectHookIndex = 0;
    effectHook(() => {
        console.log("Effect render")
        return () => console.log("cleanup")
    },[])
}
export function commitEffect(){
    //run "Cleanup"
    while(cleanupEffects.length){
        const cleanup = cleanupEffects.pop()
        try{
            cleanup()
        }catch(e){
            console.log("Cleanup Error:",e)
        }
    }
    //run new "Effect"
    while(pendingEffects.length){
        const {callback, effectHookookIndex} = pendingEffects.pop()
        try{
            const cleanup = callback();
        if(typeof cleanup === "function"){
            if(hookStates[effectHookookIndex]){
            hookStates[effectHookookIndex].cleanup = cleanup
            }
        }
    }catch(error){
        console.log("Effect Error:",error)
    }
    }
}
let effectQueue = []
export function useEffect(callback,dependencies){
    effectHook(callback,dependencies);
    if(effectQueue.length === 0){
        queueMicrotask(() => {
        renderEffect();
        commitEffect()
        effectQueue = []
        })
    }

}




