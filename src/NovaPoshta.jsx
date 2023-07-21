import React from 'react';
import NPCitySelection from './NPCitySelection';
import NPWarehouseSelection from './NPWarehouseSelection';
import styles from './NovaPoshta.module.scss'

const NovaPoshta = () => {

    return (
        <div className={styles.wrap}>
            <NPCitySelection/>
            <NPWarehouseSelection/>
        </div>
    );
}

export default NovaPoshta;