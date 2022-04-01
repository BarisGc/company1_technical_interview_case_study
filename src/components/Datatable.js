import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEpiasData1, epiasData1Selectors, setEpiasData1 }
    from "../redux/intraDayTradeHistoryListSlice";
import { Row, Col, Table } from 'react-bootstrap'

function Datatable() {
    // Use Some Hooks
    const dispatch = useDispatch();

    //States
    const [tableItemLimit, setTableItemLimit] = useState(50)
    const [conractType, setConractType] = useState("PB")

    // dispatch The Api Data
    const status = useSelector((state) => state.epiasData1.status);
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEpiasData1(tableItemLimit));
        }
    }, [dispatch, status, tableItemLimit])

    // useSelectors & Dispatch epiasData1Items Into EpiasData1 Entity
    const epiasData1Items = useSelector((state) => state.epiasData1.items);
    console.log("epiasData1Items", epiasData1Items)
    epiasData1Items && dispatch(setEpiasData1(epiasData1Items));

    // Calling epiasData1 Entity
    const epiasData1Entity = useSelector(epiasData1Selectors.selectAll)
    epiasData1Items && console.log("epiasData1Entity", epiasData1Entity)
    epiasData1Items && console.log("epiasData1Entity[0][0]", epiasData1Entity[0][0])

    // Table data which will be displayed
    const filteredData = epiasData1Entity[0] && epiasData1Entity[0].map((element, index) => {
        // element .....
        // conract: "PH22012603"
        // date: "2022-01-26T00:00:34.000+0300"
        // id: 444121195
        // price: 731.99
        // quantity: 5
        let text = element.conract
        let contractFirstTwoChar = `${text.charAt(0)}${text.charAt(1)}`
        console.log(contractFirstTwoChar)
        return element
    })

    // console.log("filteredData", filteredData)

    // Parse date from "conract" object key
    // let dataDate = []
    // let pattern = /[0-9][0-9]/g
    // let conract = "PH22012606"
    // dataDate = conract.match(pattern)
    // console.log("dataDate", dataDate)






    return (
        <Row className="">
            <Col md={{ span: 10, offset: 1 }}>
                <Table striped bordered hover size="sm" className="datatable">
                    <thead >
                        <tr>
                            <th className="text-center align-middle fs-6">Date</th>
                            <th className="text-center align-middle fs-6">Total Quantity of Transaction (MWh)</th>
                            <th className="text-center align-middle fs-6">Total Amount of Transaction (TL)</th>
                            <th className="text-center align-middle fs-6">Weighted Average Price (TL/MWh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {epiasData1Items.map((item) => (
                            <tr key={item.id}>
                                <td>{`asd`}</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default Datatable