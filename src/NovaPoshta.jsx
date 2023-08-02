import React, { useState } from "react";
import NPCitySelection from "./NPCitySelection";
import NPWarehouseSelection from "./NPWarehouseSelection";
import styles from "./NovaPoshta.module.scss";

const NovaPoshta = () => {
  const [warehouseOpen, setWarehousesOpen] = useState(false); // открыть/закрыть окно с отделениями
  return (
    <div className={styles.wrap}>
      <NPCitySelection setWarehousesOpen={setWarehousesOpen} />
      <NPWarehouseSelection
        warehouseOpen={warehouseOpen}
        setWarehousesOpen={setWarehousesOpen}
      />
    </div>
  );
};

export default NovaPoshta;
