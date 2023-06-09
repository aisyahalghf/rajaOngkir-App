import {
  Button,
  Select,
  Th,
  Td,
  Tr,
  Thead,
  Tbody,
  Table,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ShippingCost = () => {
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCityOrigin, setDataCityOrigin] = useState([]);
  const [dataCityDes, setDataCityDes] = useState([]);
  const [dataSend, setSend] = useState({
    idOrigin: null,
    cityOrigin: null,
    provinceOrigin: "-",
    postalCodeOrigin: "-",
    typeOrigin: "-",
    idDestination: null,
    cityDestination: null,
    provinceDestination: "-",
    postalCodeDestination: "-",
    typeDestination: "-",
    courier: null,
  });
  const [weight, setWeight] = useState(0);
  const [dataCost, setDataCost] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = process.env.REACT_APP_API_URL;

  const getProvince = async () => {
    try {
      let dataProvince = await axios.get(`${api}/get-province`, {});
      setDataProvince(dataProvince.data.data.rajaongkir.province);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProvince();
    // eslint-disable-next-line
  }, []);

  const getCityOrigin = async (e) => {
    try {
      let province_id = e.target.value;
      let dataCity = await axios.get(
        `${api}/get-city?province_id=${province_id}`
      );
      setDataCityOrigin(dataCity.data.data.rajaongkir.city);
    } catch (error) {
      console.log(error);
    }
  };

  const getCityDestination = async (e) => {
    try {
      let province_id = e.target.value;
      let dataCity = await axios.get(
        `${api}/get-city?province_id=${province_id}`
      );
      setDataCityDes(dataCity.data.data.rajaongkir.city);
    } catch (error) {
      console.log(error);
    }
  };

  const dataToSend = (e) => {
    let data = e.target.value;
    let newData = data.split(",");
    if (newData[0] === "origin") {
      let dataToSend = { ...dataSend };
      dataToSend.cityOrigin = newData[2];
      dataToSend.idOrigin = newData[1];
      dataToSend.provinceOrigin = newData[5];
      dataToSend.postalCodeOrigin = newData[3];
      dataToSend.typeOrigin = newData[4];
      setSend(dataToSend);
    }
    if (newData[0] === "destination") {
      let dataToSend = { ...dataSend };
      dataToSend.cityDestination = newData[2];
      dataToSend.idDestination = newData[1];
      dataToSend.provinceDestination = newData[5];
      dataToSend.postalCodeDestination = newData[3];
      dataToSend.typeDestination = newData[4];
      setSend(dataToSend);
    }
    if (newData[0] === "courier") {
      let dataToSend = { ...dataSend };
      dataToSend.courier = newData[1];
      setSend(dataToSend);
    }
  };

  const handleCheckOngkir = async () => {
    try {
      setLoading(true);
      if (
        dataSend.cityDestination === "select option" ||
        dataSend.cityOrigin === "select option" ||
        dataSend.courier === "select option"
      )
        // eslint-disable-next-line
        throw { message: "your data not complite" };
      // eslint-disable-next-line
      if (dataSend.length === 0) throw { message: " your data not complite" };

      let data = await axios.post(`${api}/get-shipping-cost`, {
        origin: dataSend.idOrigin,
        destination: dataSend.idDestination,
        weight: weight,
        courier: dataSend.courier,
      });

      setDataCost(data.data.data.rajaongkir.shipping_cost.cost[0].costs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: "Something went wrong, try later!",
      });
    }
  };

  return (
    <section className="container mx-auto my-10 ">
      <div className="  ">
        <div className=" grid grid-cols-1 md:grid-cols-2 mt-0 md:mt-10 gap-10 shadow-none  md:shadow shadow-slate-400 p-5 w-full h-full items-start  ">
          <div className=" flex flex-col items-center py-2 shadow shadow-slate-200 md:shadow-none rounded-md md:rounded-none ">
            <h1 className=" text-2xl ">Check Shipping Costs</h1>
            <div className="mt-7">
              <div className=" flex flex-col mt-[10px] gap-2 ">
                <label htmlFor="origin"> Origin: </label>
                <Select
                  placeholder="select option"
                  onChange={(e) => getCityOrigin(e)}
                >
                  {dataProvince.map((val, idx) => (
                    <option key={idx.toLocaleString()} value={val.province_id}>
                      {val.province}
                    </option>
                  ))}
                </Select>
                {dataCityOrigin.length !== 0 ? (
                  <Select
                    placeholder="select option"
                    onChange={(e) => dataToSend(e)}
                  >
                    {dataCityOrigin.map((val, idx) => (
                      <option
                        key={idx.toLocaleString()}
                        value={[
                          "origin",
                          val.city_id,
                          val.city_name,
                          val.postal_code,
                          val.type,
                          val.province,
                        ]}
                      >
                        {val.type} {val.city_name}
                      </option>
                    ))}
                  </Select>
                ) : null}
              </div>

              <div className=" flex flex-col mt-5 gap-2">
                <label htmlFor="destination"> Destination: </label>
                <Select
                  placeholder="select option"
                  onChange={(e) => getCityDestination(e)}
                >
                  {dataProvince.map((val, idx) => (
                    <option key={idx.toLocaleString()} value={val.province_id}>
                      {val.province}
                    </option>
                  ))}
                </Select>
                {dataCityDes.length !== 0 ? (
                  <Select
                    placeholder="select option"
                    onChange={(e) => dataToSend(e)}
                  >
                    {dataCityDes.map((val, idx) => (
                      <option
                        key={idx.toLocaleString()}
                        value={[
                          "destination",
                          val.city_id,
                          val.city_name,
                          val.postal_code,
                          val.type,
                          val.province,
                        ]}
                      >
                        {val.type} {val.city_name}
                      </option>
                    ))}
                  </Select>
                ) : null}
              </div>
              <div className=" flex flex-row gap-3 items-center mt-5">
                <label htmlFor="Courier"> Courier: </label>
                <Select
                  placeholder="select option"
                  id="courier"
                  onChange={(e) => dataToSend(e)}
                >
                  <option value={["courier", "jne"]}>JNE</option>
                  <option value={["courier", "pos"]}>Pos Indonesia</option>
                  <option value={["courier", "tiki"]}>TIKI</option>
                </Select>
              </div>
              <div className=" flex flex-row gap-3 items-center mt-5">
                <label htmlFor="weight"> Weight in grams : </label>
                <NumberInput
                  w="fit"
                  min={0}
                  value={weight}
                  onChange={(e) => setWeight(e)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            </div>
          </div>
          <div className=" flex flex-col py-2 items-center shadow shadow-slate-200 md:shadow-none rounded-md md:rounded-none  ">
            <h1 className=" text-2xl ">Summary</h1>
            <div className=" flex flex-col justify-between md:shadow shadow-slate-200 rounded-md px-2  w-full md:w-[600px] my-10  ">
              <div className="my-3">
                <div className=" font-bold">Origin:</div>
                <div className=" grid grid-cols-2 ml-3 ">
                  <div className="flex flex-col gap-1">
                    <div>Province</div>
                    <div>City</div>
                    <div>Postal Code</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div>{dataSend.provinceOrigin}</div>
                    <div>
                      {dataSend.typeOrigin} {dataSend.cityOrigin}
                    </div>
                    <div>{dataSend.postalCodeOrigin}</div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className=" font-bold ">Destination:</div>
                <div className=" grid grid-cols-2 ml-3 ">
                  <div className="flex flex-col gap-1">
                    <div>Province</div>
                    <div>City</div>
                    <div>Postal Code</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div>{dataSend.provinceDestination}</div>
                    <div>
                      {dataSend.typeDestination} {dataSend.cityDestination}
                    </div>
                    <div>{dataSend.postalCodeDestination}</div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className=" font-bold ">Courier:</div>
                <div className=" grid grid-cols-2 ml-3  ">
                  <div>Courier</div>
                  <div className="uppercase">{dataSend.courier} </div>
                  <div>Weight</div>
                  <div className="uppercase">{weight / 1000} kg </div>
                </div>
              </div>
            </div>

            {!dataSend.idDestination ||
            !dataSend.idOrigin ||
            !dataSend.courier ||
            weight <= 0 ||
            loading ? null : (
              <Button onClick={handleCheckOngkir} mt={2}>
                Check shipping costs in here
              </Button>
            )}
          </div>
        </div>

        <div className=" mt-2  md:mt-10 px-2 md:px-0  ">
          {dataCost.length === 0 ? null : (
            <Table size={["10px", "md"]} fontSize={["10px", "inherit"]}>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Service Name</Th>
                  <Th>Description </Th>
                  <Th>Estimation</Th>
                  <Th>Ongkir</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataCost.map((val, idx) => {
                  return (
                    <Tr key={idx.toLocaleString()}>
                      <Td>{idx + 1}</Td>
                      <Td>{val.service}</Td>
                      <Td>{val.description}</Td>
                      {val.cost.map((value) => {
                        return (
                          <>
                            <Td>{value.etd} hari </Td>
                            <Td>{value.value.toLocaleString()}</Td>
                          </>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </div>
      </div>
    </section>
  );
};
export default ShippingCost;
