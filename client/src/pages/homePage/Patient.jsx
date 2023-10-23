import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { patientsListRoute } from '../../utils/ApiRoutes';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { Container, Row } from 'react-bootstrap';
import { patientColumns } from '../../utils/tableHeaders/patientHeaders';

export const Patient = () => {

  const navigate = useNavigate();
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPatients = useCallback ( async () => {
    try {
      const res = await axios.get(patientsListRoute, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        setPatientList(res.data.patients);
        setLoading(false);
        // console.log(res.data.donors);
      }
    }
    catch (err) {
      console.log(err.response);
      setLoading(false);
      if (!err.response.data.success) {
        navigate('/error');
      }
    }
  }, [navigate])

  useEffect(() => {
    getPatients();
  }, [getPatients, navigate]);

  const paginationOptions = {
    custom: true,
    totalSize: patientList.length
  };
 
  return (
    <Container className="h-100">
      {
        loading ? (
          <LoadingSpinner />
        ) : (
          <Row className="h-100 px-lg-5 pt-4 d-flex flex-column">
            <h3 className="text-center fs-1 mb-3 text-capitalize">Patients waiting for Transfusion</h3>
            <div style={{ color: '#4682B4' }} className='overflow-auto'>
              <PaginationProvider pagination={paginationFactory(paginationOptions)} >
                {
                  ({ paginationProps, paginationTableProps }) => (
                    <div>
                      <PaginationListStandalone {...paginationProps} />
                      <BootstrapTable
                        keyField="_id"
                        data={patientList}
                        columns={patientColumns}
                        {...paginationTableProps}
                        hover
                      />
                    </div>
                  )
                }
              </PaginationProvider>
            </div>
            <p className="m-0"> <span style={{ fontWeight: 'bold', color: 'red'}}>Note:</span>  You can sort by Name and Status</p> 
          </Row>
        )
      }
    </Container>
  );
};
