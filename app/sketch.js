import Stream from "mithril-stream"
const range = (size) => [...Array(size).keys()]
let root = document.getElementById("mithril-dom")
let width = 600
let height = 600
let w = Stream(1400)
let h = Stream(1000)
let scl = Stream(20)
let flying = Stream(0)
let colOff = Stream(0)
let rowOff = Stream(0)
let terrain = Stream([[]])
let cols = range(w() / scl())
let rows = range(h() / scl())
let rotation = Stream(Math.PI / 3)
const init = () =>
  new p5((sketch) => {
    sketch.preload = () => {}

    sketch.setup = () => {
      sketch.createCanvas(width, height, sketch.WEBGL)

      rows.map((row) => {
        cols.map((col) => {
          terrain()[col] = []
          terrain()[col][row] = 0
        })
      })
    }

    sketch.draw = () => {
      sketch.rotateX(rotation())
      sketch.translate(-w() / 2, -h() / 2)
      sketch.background("#81D4FA")

      flying(flying() + 0.1)

      rowOff(flying())
      rows.map((row) => {
        colOff(0)
        cols.map((col) => {
          terrain()[col][row] = sketch.map(
            sketch.noise(colOff(), rowOff()),
            0,
            1,
            -100,
            100
          )
          colOff(colOff() + 0.21)
        })
        rowOff(rowOff() + 0.21)
      })

      rows.map((row) => {
        sketch.beginShape(sketch.TRIANGLE_STRIP)
        cols.map((col) => {
          sketch.vertex(col * scl(), row * scl(), terrain()[col][row])
          sketch.vertex(col * scl(), (row + 1) * scl(), terrain()[col][row + 1])
          if (terrain()[col][row] < -60) {
            sketch.fill("#01579B")
          } else if (terrain()[col][row] > -60 && terrain()[col][row] < -50) {
            sketch.fill("#1B5E20")
          } else if (terrain()[col][row] > -50 && terrain()[col][row] < -40) {
            sketch.fill("#1B5E20")
          } else if (terrain()[col][row] > -40 && terrain()[col][row] < -30) {
            sketch.fill("#2E7D32")
          } else if (terrain()[col][row] > -30 && terrain()[col][row] < -20) {
            sketch.fill("#388E3C")
          } else if (terrain()[col][row] > -20 && terrain()[col][row] < -10) {
            sketch.fill("#43A047")
          } else if (terrain()[col][row] > -10 && terrain()[col][row] < -0) {
            sketch.fill("#4CAF50")
          } else if (terrain()[col][row] > -0 && terrain()[col][row] < 10) {
            sketch.fill("#66BB6A")
          } else if (terrain()[col][row] > 10 && terrain()[col][row] < 20) {
            sketch.fill("#81C784")
          } else if (terrain()[col][row] > 20 && terrain()[col][row] < 30) {
            sketch.fill("#2ecc71")
          } else if (terrain()[col][row] > 30 && terrain()[col][row] < 40) {
            sketch.fill("#A5D6A7")
          } else if (terrain()[col][row] > 40 && terrain()[col][row] < 50) {
            sketch.fill("#C8E6C9")
          } else if (terrain()[col][row] > 50 && terrain()[col][row] < 100) {
            sketch.fill("#ecf0f1")
          }
        })
        sketch.endShape()
        m.redraw()
      })
    }
  })

const App = () => {
  return {
    oninit: init(),
    view: ({ attrs: { w, h, scl, rotation } }) => {
      return m(".mithril", [
        m(
          ".form-group",
          { style: { position: "absolute", top: "10px", color: "white" } },
          [
            m("input[type=range]", {
              val: rotation(),
              id: "rotateX",
              min: 0,
              max: 3,
              step: 0.1,
              oninput: (e) => rotation(e.target.value)
            }),
            m("label", { for: "rotateX" }, `X-axis: ${rotation()}`)
          ]
        ),

        m(
          ".form-group",
          { style: { position: "absolute", top: "30px", color: "white" } },
          [
            m("input[type=range]", {
              val: scl(),
              id: "rotateX",
              min: 0,
              max: 30,
              step: 0.1,
              oninput: (e) => scl(e.target.value)
            }),
            m("label", { for: "rotateX" }, `scale: ${scl()}`)
          ]
        ),

        m(
          ".form-group",
          {
            style: {
              position: "absolute",
              left: "10px",
              color: "white"
            }
          },

          [
            m(
              "button",
              {
                onclick: () => w(w() - 100),
                id: "pan-left",
                style: {
                  fontSize: "50px"
                }
              },
              "<"
            )
          ]
        ),

        m(
          ".form-group",
          {
            style: {
              position: "absolute",
              right: "10px",
              color: "white"
            }
          },

          [
            m(
              "button",
              {
                onclick: () => w(w() + 100),
                id: "pan-right",
                style: {
                  fontSize: "50px"
                }
              },
              ">"
            )
          ]
        )
      ])
    }
  }
}

m.mount(root, { view: () => m(App, { w, h, scl, rotation }) })
