import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { donorsListRoute } from '../../utils/ApiRoutes';
import { donorColumns } from '../../utils/tableHeaders/donorHeaders';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { Container, Row } from 'react-bootstrap';

export const Donor = () => {

  const navigate = useNavigate();
  const [donorList, setDonorList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDonors = useCallback ( async () => {
    try {
      const res = await axios.get(donorsListRoute, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        setDonorList(res.data.donors);
      }
    }
    catch (err) {
      console.log(err.response);
      if (!err.response.data.success) {
        navigate('/error');
      }
    }
    finally {
      setLoading(false);
    }
  }, [navigate])

  useEffect(() => {
    getDonors();
  }, [getDonors, navigate]);

  const paginationOptions = {
    custom: true,
    sizePerPage: 8,
    totalSize: donorList.length
  };
 
  return (
    <Container className="h-100">
      {
        loading ? (
          <LoadingSpinner />
        ) : (
          <Row className="h-100 px-lg-5 pt-4 d-flex flex-column">
            <h3 className="text-center fs-1 mb-3 text-capitalize">Donors ready to Tranfuse</h3>
            <div style={{ color: '#4682B4' }} className='overflow-auto'>
              <PaginationProvider pagination={paginationFactory(paginationOptions)} >
                {
                  ({ paginationProps, paginationTableProps }) => (
                    <div>
                      <PaginationListStandalone {...paginationProps} />
                      <BootstrapTable
                        keyField="_id"
                        data={donorList}
                        columns={donorColumns}
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
