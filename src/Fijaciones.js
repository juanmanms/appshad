
export const Fijaciones = (props) => {
    const articulos = props.articulos
    let url = ""
    //ordenar articulos por menu_order
    articulos.sort((a, b) => (a.menu_order > b.menu_order) ? 1 : -1)

    return (
        <div className="fijaciones-block">
            <h2>Fijaciones</h2>
            <div className="fijaciones-block-group">
                {articulos.length === 0 &&
                    <p>No hay fijaciones 2</p>
                }

                {articulos.map(articulo => (
                    //console.log(articulo),
                    //<div className="product-item product-fijacion" key={articulo.sku}>{articulo.sku}--{articulo.menu_order}
                    <div className="product-item product-fijacion" key={articulo.sku}>
                        <a href={articulo.permalink} target="_blank" rel="noreferrer">
                            <div className="none">
                                {url = "https://preprod.shad.es//assets/images/thumbs/" + articulo.images[0].title + ".jpg"
                                }
                            </div>

                            <img className="product-item-image" src={url} alt={articulo.title} />

                            <div className="product-item-title">{articulo.title}--{articulo.menu_order}</div>
                        </a>
                    </div>
                ))}

            </div>
        </div>
    )
}


