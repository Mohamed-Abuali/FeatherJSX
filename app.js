/** @jsx hs */
import { app, hs , useState} from "./index.js";


function handleClick() {
    alert("Clicked");
}
function Counter() {
    let [count, setCount] = useState(0)

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "600px",
            width: "100%",
            padding: "0 20px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        },
        header: {
            textAlign: "center",
            marginBottom: "3rem"
        },
        h1: {
            fontSize: "4rem",
            fontWeight: "800",
            letterSpacing: "-0.05em",
            margin: "0",
            background: "linear-gradient(to bottom, #000000, #444444)",
            webkitBackgroundClip: "text",
            webkitTextFillColor: "transparent",
            color: "black" // Fallback
        },
        h3: {
            fontSize: "1.2rem",
            color: "#666666",
            fontWeight: "400",
            marginTop: "1rem"
        },
        card: {
            background: "#ffffff",
            border: "1px solid #eaeaea",
            borderRadius: "12px",
            padding: "2rem 4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            transition: "boxShadow 0.2s ease"
        },
        counterDisplay: {
            fontSize: "6rem",
            fontWeight: "700",
            letterSpacing: "-0.05em",
            marginBottom: "2rem",
            fontVariantNumeric: "tabular-nums"
        },
        btnGroup: {
            display: "flex",
            gap: "1rem"
        },
        btnPrimary: {
            padding: "12px 32px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s ease",
            border: "1px solid transparent",
            backgroundColor: "#000000",
            color: "#ffffff"
        },
        btnSecondary: {
            padding: "12px 32px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s ease",
            backgroundColor: "transparent",
            border: "1px solid #eaeaea",
            color: "#000000"
        },
        footer: {
            marginTop: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#666666",
            fontSize: "0.9rem"
        },
        btnText: {
            background: "none",
            border: "none",
            color: "#666666",
            padding: "0",
            marginTop: "1rem",
            fontSize: "0.9rem",
            cursor: "pointer",
            textDecoration: "underline"
        }
    };

    return hs('div', { style: styles.container },
        hs("div", { style: styles.header },
            hs("h1", { style: styles.h1 }, "FeatherJSX"),
            hs('h3', { style: styles.h3 }, "The lightweight renderer for the future."),
        ),
        hs("svg",{src:"http://www.w3.org/2000/svg"},''),
        hs("div", { style: styles.card },
            hs("div", { style: styles.counterDisplay }, count),
            hs('div', { style: styles.btnGroup },
                hs('button', { style: styles.btnSecondary, onClick: () => setCount(count - 1) }, '-'),
                hs('button', { style: styles.btnPrimary, onClick: () => setCount(count + 1) }, '+')
            )
        ),
        hs("div", { style: styles.footer },
            hs('p', null, "Built with vanilla JS & custom VDOM."),
            hs('button', { style: styles.btnText, onClick: handleClick }, 'Documentation')
        )
    )
}

app(Counter)




