import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEpiasData1, epiasData1Selectors, setEpiasData1 }
    from "../redux/intraDayTradeHistoryListSlice";
import { Row, Col, Table } from 'react-bootstrap'

function Datatable() {

    // useSelectors & Dispatch epiasData1Items
    const dispatch = useDispatch();
    const epiasData1Items = useSelector((state) => state.epiasData1.items);
    epiasData1Items[0] && dispatch(setEpiasData1(epiasData1Items));
    const status = useSelector((state) => state.epiasData1.status);

    //States
    const [tableItemLimit, setTableItemLimit] = useState(50)

    // Calling epiasData1 Entity
    const epiasData1Entity = useSelector(epiasData1Selectors.selectAll)

    // dispatch The Api Data
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEpiasData1(tableItemLimit));
        }
    }, [dispatch, status, tableItemLimit])

    console.log("epiasData1Entity", epiasData1Entity)

    // Table data which will be displayed

    // Parse date from "conract" object key
    let dataDate = []
    let pattern = /[0-9][0-9]/g
    let conract = "PH22012606"
    dataDate = conract.match(pattern)
    console.log("dataDate", dataDate)






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