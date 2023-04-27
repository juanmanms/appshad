import { useEffect, useState } from 'react'
import { Fijaciones } from './Fijaciones'

export const Selector = () => {



    const url_motos = 'https://preprod.shad.es/assets/json/marca_modelo_anyo.json'
    const url_fijaciones = 'https://preprod.shad.es/assets/json/fijacion_modelo.json'
    const url_articulos = 'https://preprod.shad.es/assets/json/articulos.json'

    const [marcas, setMarcas] = useState([])
    const [modelos, setModelos] = useState([])
    const [anyos, setAnyos] = useState([])
    const [codigoModelo, setCodigoModelo] = useState("")
    const [fijaciones, setFijaciones] = useState([])
    const [ptm, setPtm] = useState([])

    const [selectMarca, setSelectMarca] = useState("")
    const [selectModelo, setSelectModelo] = useState("")
    const [selectAnyo, setSelectAnyo] = useState("all")


    const getMarcas = async () => {
        const response = await fetch(url_motos)
        const data = await response.json()
        //quitar Marcas duplicadas
        setMarcas([...new Set(data.map(moto => moto.Marca))])
    }

    const getModelos = async () => {
        const response = await fetch(url_motos)
        //filtrar data por selectMarca
        const data = await response.json()
        const dataFiltrada = data.filter(moto => moto.Marca === selectMarca)
        setModelos([...new Set(dataFiltrada.map(moto => moto.Modelo))])
    }

    const getAnyos = async () => {
        const response = await fetch(url_motos)
        //filtrar data por selectModelo
        const data = await response.json()
        const dataFiltrada = data.filter(moto => moto.Modelo === selectModelo)
        if (dataFiltrada.length > 0) {
            setCodigoModelo(dataFiltrada[0]["Codigo Modelo"])
        }
        setAnyos(dataFiltrada.map(moto => moto.year))
    }

    const getFijaciones = async () => {
        const responsea = await fetch(url_articulos)
        const dataa = await responsea.json()
        const response = await fetch(url_fijaciones)
        const data = await response.json()
        let dataFiltrada = []
        if (selectAnyo === "all") {
            dataFiltrada = data.filter(fijacion => fijacion.Fijacion_Modelo === codigoModelo && !fijacion.Fijacion.startsWith('REF_'))
        } else {
            dataFiltrada = data.filter(fijacion => fijacion.Fijacion_Modelo === codigoModelo && fijacion.Fijacion_Anyo == selectAnyo && !fijacion.Fijacion.startsWith('REF_'))
        }

        //let dataFiltrada = data.filter(fijacion => fijacion.Fijacion_Modelo === codigoModelo && !fijacion.Fijacion.startsWith('REF_'))
        dataFiltrada = [...new Set(dataFiltrada.map(fijacion => fijacion.Fijacion))]
        setFijaciones(dataFiltrada)
        const articulosfiltrados = dataa.filter(articulo => dataFiltrada.includes(articulo.SKU))

        articulosfiltrados.sort((a, b) => (a.Order > b.Order) ? 1 : -1)

        return articulosfiltrados

    }

    const getArticulos = (fijaciones) => {
        fijaciones.map(fijacion => {
            console.log("https://preprod.shad.es/wc-api/v3/products?filter[sku]=" + fijacion.SKU + "&consumer_key=ck_ba8c741efe83858f8d748707026f0a933d3c486c&consumer_secret=cs_cfe7fd819bc78fac8522cd37fba51a3f4c0261da")
            fetch("https://preprod.shad.es/wc-api/v3/products?filter[sku]=" + fijacion.SKU + "&consumer_key=ck_ba8c741efe83858f8d748707026f0a933d3c486c&consumer_secret=cs_cfe7fd819bc78fac8522cd37fba51a3f4c0261da")
                .then(response => response.json())
                .then(data => {
                    //console.log(data.products[0])
                    setPtm(ptm => [...ptm, data.products[0]])
                })
        })

        //setPtm(fijaciones)
    }








    useEffect(() => {
        getMarcas()
    }, [])
    useEffect(() => {
        getModelos()
    }, [selectMarca])
    useEffect(() => {
        getAnyos()
    }, [selectModelo]
    )









    //si chageBrana cambia se marca el selectMarca
    const changeMarca = (e) => {
        setSelectMarca(e.target.value)
        setPtm([])
        document.getElementById("modelChange").disabled = false
    }
    const changeModelo = (e) => {
        setSelectModelo(e.target.value)
        setPtm([])
        document.getElementById("yearChange").disabled = false
    }
    const changeAnyo = (e) => {
        setSelectAnyo(e.target.value)
        setPtm([])
        document.getElementById("changeModel").disabled = false
    }
    //al apretar boton buscar moto se busca el codigoModelo
    const buscarMoto = () => {
        const articulos = Promise.resolve(
            getFijaciones()
        )

        //
        setTimeout(() => {
            //obtener resultado de la promesa
            articulos.then((articulos) => {
                getArticulos(articulos)
            })
        }, 500);
        console.log(selectMarca, selectModelo, selectAnyo, codigoModelo)
    }








    return (
        <div className="config-area fijaciones-widget">
            <div className="selected-group">
                <select name="brandChange" id="brandChange" onChange={changeMarca} >
                    <option value="">Selecciona una marca</option>
                    {marcas.map((marca, index) => (
                        <option key={index} value={marca}>{marca}</option>
                    ))}

                </select>
                <select name="modelChange" id="modelChange" disabled onChange={changeModelo}>
                    <option value="">Selecciona un Modelo</option>
                    {modelos.map((modelo, index) => (
                        <option key={index} value={modelo}>{modelo}</option>
                    ))}

                </select>
                <select name="yearChange" id="yearChange" disabled onChange={changeAnyo}>
                    {anyos.length < 1
                        ? <option value="">Selecciona un año</option>
                        : (<option value="all">Todos los años</option>)}
                    {anyos.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}

                </select>
                <button id="changeModel" onClick={buscarMoto}>Buscar moto</button>
            </div>
            <div className="fijaciones-block">
                <h2>FIJACIONES COMPATIBLES </h2>
                {ptm.length < 1
                    ? <p>No hay fijaciones compatibles</p>
                    : <Fijaciones articulos={ptm} />
                }
            </div>
        </div>
    )
}
