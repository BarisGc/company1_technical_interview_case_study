import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEpiasData1 }
    from "../redux/intraDayTradeHistoryListSlice";
import { Row, Col, Table } from 'react-bootstrap'

function Datatable() {
    // Use Some Hooks
    const dispatch = useDispatch();

    //States
    const [tableItemLimit, setTableItemLimit] = useState()
    const [conractType, setConractType] = useState("PH")

    // dispatch The Api Data
    const status = useSelector((state) => state.epiasData1.status);
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEpiasData1(tableItemLimit));
        }
    }, [dispatch, status, tableItemLimit])

    // Call & Use Api Data of State
    const epiasData1Items = useSelector((state) => state.epiasData1.items);
    console.log("epiasData1Items", epiasData1Items)
    //1.0 Table data which will be displayed

    //1.1 Define Unique Conract Values
    let conractValueArray = epiasData1Items.map((item) => (item.conract))
    let uniqueConractValueArray = [...new Set(conractValueArray)];

    let typeFilteredUniqueConractValueArray = uniqueConractValueArray.filter((item) => {

        let contractFirstTwoChar = `${item.charAt(0)}${item.charAt(1)}`

        return contractFirstTwoChar === conractType
    })


    // console.log("typeFilteredUniqueConractValueArray", typeFilteredUniqueConractValueArray)

    //1.2 Prepare Functions to define wanted values for a "conract" class and group them
    // Toplam İşlem Tutarı = (price*quantity)/10 değerlerinin toplamı;
    // Toplam İşlem Miktarı = İlgili conract’a ait sınıfların quantity/10 değerlerinin toplamı;
    // Ağırlıklı Ortalama Fiyat = Toplam İşlem Tutarı/Toplam İşlem Miktarı formülü ile hesaplanacaktır.

    // dataGroupedByconractArray
    let dataGroupedByconractArray = [];
    typeFilteredUniqueConractValueArray.forEach((wantedConract) => {
        let filtered = epiasData1Items.filter((element) => {
            return element.conract === wantedConract
        })
        dataGroupedByconractArray.push(filtered)
    })
    console.log("dataGroupedByconractArray", dataGroupedByconractArray)

    // PH22020720
    let dateFormattedTypeFilteredUniqueConractValueArray =
        typeFilteredUniqueConractValueArray.map((stringItem) => (stringItem.match(/\d\d\d\d\d\d\d\d/g)))

    dateFormattedTypeFilteredUniqueConractValueArray.sort(function (a, b) { return a - b });
    console.log("test2", dateFormattedTypeFilteredUniqueConractValueArray)
    // totalQuantityOfTransactionForEachConractArray
    let totalQuantityOfTransactionForEachConractArray = [];
    dataGroupedByconractArray.forEach((itemAsArray) => {
        let totalQuantityForConract = itemAsArray.reduce((previousValue, currentValue) => {
            // console.log("previousValue", previousValue, "currentValue", currentValue.quantity)
            return previousValue + currentValue.quantity
        }, 0)
        totalQuantityOfTransactionForEachConractArray.push(Math.round(totalQuantityForConract / 10))
    })
    console.log("totalQuantityOfTransactionForEachConractArray",
        totalQuantityOfTransactionForEachConractArray)

    // totalAmountOfTransactionEachConractArray
    let totalAmountOfTransactionEachConractArray = [];
    dataGroupedByconractArray.forEach((itemAsArray) => {
        let totalAmountForConract = itemAsArray.reduce((previousValue, currentValue) => {
            // console.log("previousValue", previousValue, "currentValue", currentValue.price)
            return previousValue + (currentValue.price * currentValue.quantity)
        }, 0)
        totalAmountOfTransactionEachConractArray.push(Math.round(totalAmountForConract / 10))
    })
    console.log("totalAmountOfTransactionEachConractArray",
        totalAmountOfTransactionEachConractArray)

    // WeightedAveragePrice(TL/MWh)
    let WeightedAveragePrice_TLdividedMWh = [];

    for (let i = 0; i < dataGroupedByconractArray.length; i++) {
        WeightedAveragePrice_TLdividedMWh.push
            (Math.round(totalAmountOfTransactionEachConractArray[i] / totalQuantityOfTransactionForEachConractArray[i]))
    }
    console.log("WeightedAveragePrice_TLdividedMWh", (WeightedAveragePrice_TLdividedMWh))
    // .reduce((previousValue, currentValue) => {
    //     console.log("test", previousValue.quantit, currentValue.quantity)
    //     return previousValue.quantity + currentValue.quantity
    // }, 0)
    // console.log("totalQuantityOfTransactionForEachConract", totalQuantityOfTransactionForEachConract)
    // element .....
    // conract: "PH22012603"
    // date: "2022-01-26T00:00:34.000+0300"
    // id: 444121195
    // price: 731.99
    // quantity: 5

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
                    {/* <tbody>
                        {epiasData1Items.map((item) => (
                            <tr key={item.id}>
                                <td>{`asd`}</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                        ))}
                    </tbody> */}
                </Table>
            </Col>
        </Row>
    )
}

export default Datatable