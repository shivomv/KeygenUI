import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Pagination } from 'react-bootstrap';
import { useUser } from './../../context/UserContext';
const baseUrl = process.env.REACT_APP_BASE_URL;

const JumblingConfig = () =>{
    const { keygenUser } = useUser();
    const [progConfig, setProgConfigs] = useState([]);
    const [programme, setProgrammes] = useState([]);
    const [configurations, setConfigurations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [configurationsPerPage] = useState(2);
    const [filteredConfigurations, setFilteredConfigurations] = useState([]);
    useEffect(() => {
        fetchProgrammes();
        fetchProgConfig();
},[]);

    const fetchProgrammes = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/Programmes`,{ headers: { Authorization: `Bearer ${keygenUser?.token}` } });
            setProgrammes(response.data);
          } catch (error) {
            console.error('Error fetching groups:', error);
          }
    };

    const fetchProgConfig = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/ProgConfigs`,{ headers: { Authorization: `Bearer ${keygenUser?.token}` } });
          setProgConfigs(response.data);
        } catch (error) {
          console.error('Error fetching sessions:', error);
        }
      };

      const [formData, setFormData] = useState({
        progConfigID: 0,
        progID: 0,
        sets: 0,
        setOrder: '',
        numberofQuestions: 0,
        bookletSize: 0,
        numberofJumblingSteps: 0,
        setofStepsID: 0,
        setofSteps: ['']
      });

      const handleInputChange = (field, value) => {
        setFormData({
          ...formData,
          [field]: value
        });
        filterConfigurations(field, value);
      };

      const filterConfigurations = () => {
        let filtered = configurations;
        if (formData.progID) {
          console.log(formData.progID)
          filtered = configurations.filter(config =>
            config.progID === parseInt(formData.progID)
          );
          console.log(filtered);
        }
        else if (formData.progID && formData.bookletSize) {
          console.log(formData.progID, formData.bookletSize)
          filtered = configurations.filter(config =>
            config.progID === parseInt(formData.progID) &&
            config.bookletSize === parseInt(formData.bookletSize)
          );
          console.log(filtered);
        }
    
        setFilteredConfigurations(filtered);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form with data:', formData);
    
        try {
          const response = await axios.post(`${baseUrl}/api/ProgConfigs`,formData,{ headers: { Authorization: `Bearer ${keygenUser?.token}` } });
          if (response.status !== 200) {
            throw new Error('Failed to submit form');
          }
    
          // Reset form data if submission was successful
          setFormData({
            progConfigID: 0,
            progID: 0,
            sets: 0,
            setOrder: '',
            numberofQuestions: 0,
            bookletSize: 0,
            numberofJumblingSteps: 0,
            setofStepsID: 0,
            setofSteps: ['']
          });
    
          console.log('Form submitted successfully');
        } 
        catch (error) {
          console.error('Error submitting form:', error);
        }
      };

      const renderStepFields = () => {
        const fields = [];
        for (let i = 1; i <= formData.numberofJumblingSteps; i++) {
          const fieldName = `step${i}`;
          fields.push(
            <Col key={i}>
              <Form.Group controlId={fieldName}>
                <Form.Label>{`Step ${i}`}</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.setofSteps[i - 1] || ''}
                  onChange={(e) => handleStepChange(i, e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          );
        }
        return fields;
      }
      

      const handleStepChange = (stepNumber, value) => {
        const newSetofSteps = [...formData.setofSteps];
        newSetofSteps[stepNumber - 1] = value;
        setFormData({
          ...formData,
          setofSteps: newSetofSteps
        });
      };

      const indexOfLastConfiguration = currentPage * configurationsPerPage;
      const indexOfFirstConfiguration = indexOfLastConfiguration - configurationsPerPage;
      const currentConfigurations = filteredConfigurations.slice(indexOfFirstConfiguration, indexOfLastConfiguration);
    
      const paginate = (pageNumber) => setCurrentPage(pageNumber);

      return (
        <Container>
          <Row className='row-cols-1 row-cols-md-2'>
            <Col>
              <Card>
                <Card.Body>
                  <h2>Previous Configurations</h2>
                  {filteredConfigurations.length === 0 ? (
                    <p>No configurations found.</p>
                  ) : (
                    <>
                      <Row className='row-cols-1 row-cols-lg-2 '>
                        {progConfig.map((config) => (
                          <Col key={config.id} >
                            <Card className='mt-2'>
                              <Card.Body>
                                <strong>Master Name:</strong> {config.masterName} <br />
                                {/* <strong>Group Name:</strong> {groups.find((group) => group.groupID === config.groupID)?.groupName} <br />
                                <strong>Session Name:</strong> {sessions.find((session) => session.session_Id === config.sessionID)?.session_Name} <br /> */}
                                <strong>Master Name:</strong> {config.masterName} <br />
                                <strong>Number of Questions:</strong> {config.numberofQuestions} <br />
                                <strong>Booklet Size:</strong> {config.bookletSize} <br />
                                <strong>Number of Jumbling Steps:</strong> {config.numberofJumblingSteps} <br />
                                {/* <strong>Steps:</strong> {config.setofSteps.join(', ')} <br /> */}
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      <div className="d-flex align-items-center gap-3 justify-content-center mt-3">
                        <Pagination>
                          <Pagination.First onClick={() => paginate(1)} />
                          {/* <Pagination.Prev onClick={() => paginate(currentPage - 1)} /> */}
                          {currentPage > 2 && <Pagination.Ellipsis />}
                          {currentPage > 1 && <Pagination.Item onClick={() => paginate(currentPage - 1)}>{currentPage - 1}</Pagination.Item>}
                          <Pagination.Item active>{currentPage}</Pagination.Item>
                          {currentPage < Math.ceil(filteredConfigurations.length / configurationsPerPage) && <Pagination.Item onClick={() => paginate(currentPage + 1)}>{currentPage + 1}</Pagination.Item>}
                          {currentPage < Math.ceil(filteredConfigurations.length / configurationsPerPage) - 1 && <Pagination.Ellipsis />}
                          <Pagination.Last onClick={() => paginate(Math.ceil(filteredConfigurations.length / configurationsPerPage))} />
                        </Pagination>
                        <p>Page {currentPage} of {Math.ceil(filteredConfigurations.length / configurationsPerPage)}</p>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <h3 className='text-center'>Create new configuration</h3>
                  {/* <Alert variant="info">
                    Create new configuration.
                  </Alert> */}
                  <Form onSubmit={handleSubmit}>
                    <Row className='row-cols-1 row-cols-md-2'>
                      <Col>
                        <Form.Group controlId="programmeID">
                          <Form.Label>Program</Form.Label>
                          <Form.Control as="select" value={formData.progID} onChange={(e) => handleInputChange('progID', e.target.value)} required>
                            <option value="">Select a Program</option>
                            {programme.map((prog) => (
                              <option key={prog.programmeID} value={prog.programmeID}>{prog.programmeName}</option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      {/* <Col>
                        <Form.Group controlId="sessionID">
                          <Form.Label>Session</Form.Label>
                          <Form.Control as="select" value={formData.sessionID} onChange={(e) => handleInputChange('sessionID', e.target.value)} required>
                            <option value="">Select a session</option>
                            {sessions.map((session) => (
                              <option key={session.session_Id} value={session.session_Id}>{session.session_Name}</option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col> */}
                      <Col>
                        <Form.Group controlId="bookletSize">
                          <Form.Label>Booklet Size</Form.Label>
                          <Form.Control type="number" value={formData.bookletSize} onChange={(e) => handleInputChange('bookletSize', e.target.value)} required />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="numberofQuestions">
                          <Form.Label>Number of Questions</Form.Label>
                          <Form.Control type="number" value={formData.numberofQuestions} onChange={(e) => handleInputChange('numberofQuestions', e.target.value)} required />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="sets">
                          <Form.Label>Sets</Form.Label>
                          <Form.Control type="number" value={formData.sets} onChange={(e) => handleInputChange('sets', e.target.value)} required />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="setOrder">
                          <Form.Label>Set Order</Form.Label>
                          <Form.Control type="text" value={formData.setOrder} onChange={(e) => handleInputChange('setOrder', e.target.value)} required />
                        </Form.Group>
                      </Col>
                      {/* <Col>
                        <Form.Group controlId="masterName">
                          <Form.Label>Master Name</Form.Label>
                          <Form.Control type="text" value={formData.masterName} onChange={(e) => handleInputChange('masterName', e.target.value)} required />
                        </Form.Group>
                      </Col> */}
                      <Col>
                        <Form.Group controlId="numberofJumblingSteps">
                          <Form.Label>Number of Jumbling Steps</Form.Label>
                          <Form.Control type="number" value={formData.numberofJumblingSteps} onChange={(e) => handleInputChange('numberofJumblingSteps', e.target.value)} required />
                        </Form.Group>
                      </Col>
    
                      {renderStepFields()}
                    </Row>
                    <div className="text-center mt-3">
                      <Button type="submit">Add Configuration</Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
}

export default JumblingConfig;