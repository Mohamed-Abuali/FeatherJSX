/** @jsx hs */
import { app, hs , useState} from "./index.js";
import { helloWorld } from "./components/button.js";


function handleClick() {
    alert("Clicked");
}
function Counter() {
    let [count, setCount] = useState(0)
    return hs('div', { class: "container" },
        hs("div", { class: "header" },
            hs("h1", null, "FeatherJSX"),
            hs('h3', null, "The lightweight renderer for the future."),
        ),
        hs("div", { class: "card" },
            hs("div", { class: "counter-display" }, count),
            hs('div', { class: 'btn-group' },
                hs('button', { class: "btn secondary", onClick: () => setCount(count--) }, '-'),
                hs('button', { class: "btn primary", onClick: () => setCount(count++) }, '+')
            )
        ),
        hs("div", { class: "footer" },
            hs('p', null, "Built with vanilla JS & custom VDOM."),
            hs('button', { class: "btn text", onClick: handleClick }, 'Documentation')
        )
    )
}

app(Counter)




