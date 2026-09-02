// A renderer with no GPU behind it names itself: Chrome's SwiftShader, Mesa's
// llvmpipe, a platform's software fallback. Any of them rasterises a shader on
// the same thread the page is laid out on.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i

/**
 * Whether a WebGL context is being drawn in software.
 *
 * A decoration that animates on a GPU for nothing costs, on such a machine,
 * more per frame than the page paints in the same time, so what asks this
 * draws its one frame and holds it.
 *
 * @param {WebGLRenderingContext | WebGL2RenderingContext} gl
 * @returns {boolean}
 */
export function drawsInSoftware(gl) {
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = info
    ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
    : gl.getParameter(gl.RENDERER)
  return SOFTWARE_RENDERER.test(String(renderer || ''))
}
