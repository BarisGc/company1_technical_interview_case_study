import numeral from 'numeral';
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
    const [iSOnlyCurrentDayDate, setIsOnlyCurrentDayDate] = useState(true)

    // Get Current Date & Format
    // should be >>>>> let endDate = "2022-01-26";
    // should be >>>>> let startDate = "2022-01-26";
    var myCurrentDate = new Date(); // 02/04/2022
    var myCurrentDateString = myCurrentDate.getFullYear() + '-' + ('0' + (myCurrentDate.getMonth() + 1)).slice(-2) + '-' + ('0' + myCurrentDate.getDate()).slice(-2); // 2022-04-02

    //States
    const [startDate, setStartDate] = useState(myCurrentDateString) // 2022-04-02
    const [endDate, setEndDate] = useState(myCurrentDateString) // 2022-04-02

    // dispatch The Api Data
    const status = useSelector((state) => state.epiasData1.status);
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEpiasData1(
                {
                    tableItemLimit: tableItemLimit,
                    startDate: startDate,
                    endDate: endDate,
                }
            ));
        }
    }, [dispatch, status, tableItemLimit, startDate, endDate])

    // Call & Use Api Data of State
    const epiasData1Items = useSelector((state) => state.epiasData1.items);
    console.log("epiasData1Items", epiasData1Items)

    //1.0 Table data which will be displayed

    //1.1 Define Unique and Selected Conract Values
    let conractValueArray = epiasData1Items.map((item) => (item.conract))
    let uniqueConractValueArray = [...new Set(conractValueArray)];

    // console.log("uniqueConractValueArray", uniqueConractValueArray)
    let typeFilteredUniqueConractValueArray = uniqueConractValueArray.filter((conract) => {
        //conract: "PH22040506"
        let contractFirstTwoChar = `${conract.charAt(0)}${conract.charAt(1)}`
        let getOnlyCurrentDay = `${conract.charAt(6)}${conract.charAt(7)}`
        return iSOnlyCurrentDayDate ? contractFirstTwoChar === conractType && getOnlyCurrentDay === (myCurrentDateString[8] + myCurrentDateString[9]) : contractFirstTwoChar === conractType
    })

    // console.log("typeFilteredUniqueConractValueArray", typeFilteredUniqueConractValueArray)

    //1.2 Prepare Functions to define wanted values for a "conract" class and group them

    // Toplam İşlem Tutarı = (price*quantity)/10 değerlerinin toplamı;
    // Toplam İşlem Miktarı = İlgili conract’a ait sınıfların quantity/10 değerlerinin toplamı;
    // Ağırlıklı Ortalama Fiyat = Toplam İşlem Tutarı/Toplam İşlem Miktarı formülü ile hesaplanacaktır.

    // Api Data Element ...
    // conract: "PH22012603"
    // date: "2022-01-26T00:00:34.000+0300"
    // id: 444121195
    // price: 731.99
    // quantity: 5

    // dataGroupedByconractArray
    let dataGroupedByconractArray = [];

    // Example "conract": PH22020720 format & sort date
    let dateFirstTimeFormattedTypeFilteredUniqueConractValueArray =
        typeFilteredUniqueConractValueArray.map((stringItem) => (stringItem.match(/\d\d\d\d\d\d\d\d/g)))

    dateFirstTimeFormattedTypeFilteredUniqueConractValueArray.sort(function (a, b) { return a - b });

    let dateSecondTimeFormattedTypeFilteredUniqueConractValueArray = dateFirstTimeFormattedTypeFilteredUniqueConractValueArray.map((stringItem) => (
        conractType + stringItem
    ))

    // console.log("dateSecondTimeFormattedTypeFilteredUniqueConractValueArray", dateSecondTimeFormattedTypeFilteredUniqueConractValueArray)

    dateSecondTimeFormattedTypeFilteredUniqueConractValueArray.forEach((wantedConract) => {
        let filtered = epiasData1Items.filter((element) => {
            return element.conract === wantedConract
        })
        dataGroupedByconractArray.push(filtered)
    })
    console.log("dataGroupedByconractArray", dataGroupedByconractArray)


    // totalQuantityOfTransactionForEachConractArray
    let totalQuantityOfTransactionForEachConractArray = [];
    dataGroupedByconractArray.forEach((itemAsArray) => {
        let totalQuantityForConract = itemAsArray.reduce((previousValue, currentValue) => {
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



    // Merging dataArrays into single dataObject
    // dataGroupedByconractArray + totalQuantityOfTransactionForEachConractArray + totalAmountOfTransactionEachConractArray + WeightedAveragePrice_TLdividedMWh >>>>> epiasData1TableData

    const epiasData1TableData = dataGroupedByconractArray.map((item1, index) => {
        return ({
            ...item1,
            totalQuantity: totalQuantityOfTransactionForEachConractArray[index],
            totalAmount: totalAmountOfTransactionEachConractArray[index],
            WeightedAveragePrice: WeightedAveragePrice_TLdividedMWh[index],
            conract: item1[0].conract
        })
    })

    epiasData1TableData && console.log("epiasData1TableData", epiasData1TableData)
    epiasData1TableData[0] && console.log("epiasData1TableData[0]", epiasData1TableData[0])
    epiasData1TableData[0] && console.log("epiasData1TableData[0][0]", epiasData1TableData[0][0])
    epiasData1TableData[0] && console.log("epiasData1TableData[0].conract", epiasData1TableData[0].conract)
    epiasData1TableData[0] && console.log("epiasData1TableData[0].totalQuantity", epiasData1TableData[0].totalQuantity)
    epiasData1TableData[0] && console.log("epiasData1TableData[0].totalAmount", epiasData1TableData[0].totalAmount)
    epiasData1TableData[0] && console.log("epiasData1TableData[0].WeightedAveragePrice", epiasData1TableData[0].WeightedAveragePrice)

    // customerDateFormatter For Date Data In the DataTable
    // input: 22012602 output: should be 26.01.2022 02:00
    // input: 22020713 output: should be 7.02.2022 13:00
    let customDateFormatter = (dateString) => {

        let formattedTextArr = ["", "", "", ""]; // ['7', '02', '2022', '13:00']

        let formattedTextString = "";

        let pattern = /\d\d/g
        dateString.match(pattern).forEach((element, index) => {
            // day
            if (index === 2) {
                element[0] === "0" ? formattedTextArr[0] = element[1] : formattedTextArr[0] = element
            }
            // month
            else if (index === 1) {
                formattedTextArr[1] = element
            }
            // year
            else if (index === 0) {
                formattedTextArr[2] = "20" + element
            }
            // hour
            else if (index === 3) {
                formattedTextArr[3] = "\u00A0" + element + ":00"
            }
        })

        formattedTextString = formattedTextArr.join(".").replace(".\u00A0", "\u00A0") // 7.02.2022. 13:00 >>>>> 7.02.2022 13:00
        // console.log("formattedTextString", formattedTextString)
        return formattedTextString
    }

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
                    {/* const spendedBudgetFormatted = numeral(spendedBudget).format('0,0.00'); */}
                    <tbody>
                        {epiasData1TableData.map((data) => (
                            <tr key={data.conract}>
                                <td className="ps-5">{`${customDateFormatter(data.conract.match(/\d\d\d\d\d\d\d\d/gi).join(""))}`}</td>
                                <td>{`${numeral(data.totalQuantity).format('0,0.00')}`}</td>
                                <td className="moneyData">
                                    <span className="ms-2">&#8378;</span>
                                    <span>{`${numeral(data.totalAmount).format('0,0.00')}`}</span>
                                </td>

                                <td>{`${numeral(data.WeightedAveragePrice).format('0,0.00')}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default Datatable