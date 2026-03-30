/** @jsx hs */
import { hs, useState, useEffect } from './index.js';

/**
 * Link Component
 * Renders an anchor tag that navigates to a different route without a page reload.
 * @param {object} props - { to: string, children: any }
 */
export function Link({ to, children }) {
    const handleClick = (event) => {
        event.preventDefault();
        window.history.pushState({}, '', to);
        // Dispatch a popstate event to notify the Router of the URL change
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    };

    return hs('a', { href: to, onClick: handleClick }, children);
}

/**
 * Route Component
 * A configuration component that maps a path to a component.
 * It doesn't render anything itself; the Router reads its props.
 * @param {object} props - { path: string, component: function }
 */
export function Route({ path, component }) {
    // This component is a placeholder for the Router.
    return null;
}

/**
 * Router Component
 * Manages the routing state and renders the matching Route.
 * @param {object} props - { children: Array<VNode> }
 */
export function Router({ children }) {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', onLocationChange);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('popstate', onLocationChange);
    }, []);

    let matchedRoute = null;
    // Find the first child Route that matches the current path
    for (const child of children) {
        if (child && child.attributes && child.attributes.path === currentPath) {
            matchedRoute = child;
            break;
        }
    }

    if (matchedRoute) {
        // If a match is found, render the component associated with it.
        return hs(matchedRoute.attributes.component);
    }

    // Optional: Render a 404 Not Found component if no route matches
    return hs('div', null, '404 - Not Found');
}
