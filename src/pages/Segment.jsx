import axios from 'axios';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Segment() {

  let finalArray = [];

  const toastOption = {
    position: 'bottom-right',
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
  }

  const [opt, setOPT] = useState(['FirstName', 'LastName', 'Gender', 'Age', 'Account Name', 'City', 'State'])

  const [name, setName] = useState('')

  const optArray = { name: opt, value: '', isShow: false };

  const [schema, setSchema] = useState([optArray])

  const createInput = () => {
    setSchema([...schema, optArray])
  }

  const removeSchema = (index) => {
    schema.splice(index, 1)
    setSchema([...schema])
  }

  const handler = (e, i) => {
    if (e.target.name === 'name') {
      schema[i][e.target.name] = [e.target.value]
      schema[i].isShow = true
      for (let j = 0; j < opt.length; j++) {
        if (e.target.value === opt[j]) {
          opt.splice(j, 1)
          setOPT([...opt])
          break;
        }
      }
    } else {
      schema[i][e.target.name] = e.target.value
    }
    setSchema([...schema])
  }


  const sendData = () => {
    schema.forEach(e => {
      finalArray.push({ [e.name]: e.value })
    })
    console.log(finalArray);
    if (isValidationSuccess()) {
      postSchema()
    }
  }

  const isValidationSuccess = () => {
    if (name === '') {
      toast.error('Please enter segment name', toastOption);
      return false
    }

    if (schema.length === 0) {
      toast.error('Schema length should be greater then zero', toastOption);
      return false
    }

    for (let i = 0; i < finalArray.length; i++) {
      let key = Object.keys(finalArray[i]);
      if (finalArray[i][key[0]] === '') {
        toast.error('Please provide valid schema', toastOption);
        return false;
      }
    }
    return true
  }

  const postSchema = async () => {
    let data = {
      segment_name: name,
      schema: finalArray
    }
    await axios.post('https://webhook.site/4ceff5cd-12b2-4d04-8f97-d8b97b3f641c', data)
      .then(rel => alert('Post schema successfully'))
      .catch(err => toast.error('Something went worng please try again later.', toastOption))
  }

  return (
    <>
      <div className='container mt-5'>
        <button type='button' className='btn btn-outline-success' data-bs-toggle='modal' data-bs-target='#exampleModal'>
          Save Segment
        </button>
        <div className='modal fade' id='exampleModal' tabindex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div className='modal-dialog modal-dialog-scrollable'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>Save Segment</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div className='modal-body'>
                <div className='container'>
                  <h6 className='mt-2'>Enter the Name of the Segment</h6>
                  <div className='input-group mt-2'>
                    <input type='text' className='form-control' value={name} onChange={(e) => { setName(e.target.value) }} />
                  </div>
                  <div className='mt-2'>You save your segment, you need to add the schemas to build the query.</div>
                  <div className='row'>
                    <div className='col-md-3'></div>
                    <div className='col-md-9'>
                      <div className='row'>
                        <div className='col-md-6 text text-center'><i className='bi bi-dot fs-1 text-success'></i>User Traits</div>
                        <div className='col-md-6 text text-center'><i className='bi bi-dot fs-1 text-danger'></i>Group Traits</div>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-2'>
                    {
                      schema.map((x, i) => {
                        return (
                          <div className='container mt-2' key={i}>
                            <div className='row'>
                              <div className='col-md-1'></div>
                              <div className='col-md-10'>
                                {
                                  x.isShow ?
                                    <div className='form-floating'>
                                      <input type='text' className='form-control' onChange={(e) => handler(e, i)} name='value' value={x.value} id='floatingInput' />
                                      <label for='floatingInput'>{x.name[0]}</label>
                                    </div>
                                    :
                                    <div className='input-group'>
                                      <select type='text' className='form-control' onChange={(e) => handler(e, i)} name='name' id='floatingInput' >
                                        <option>--Select--</option>
                                        {
                                          x.name.map((s, t) => {
                                            return (
                                              <option value={s} key={t}>{s}</option>
                                            )
                                          })
                                        }
                                      </select>
                                    </div>
                                }
                              </div>
                              <div className='col-md-1'><i className='bi bi-file-minus-fill fs-3' onClick={() => removeSchema(i)}></i></div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <a id='addElements' className='text text-success fs-6 mt-5' style={{ cursor: 'pointer' }} onClick={createInput}>+ Add new schema</a>
                </div>
              </div>
              <div className='modal-footer'>
                <button type='button' onClick={sendData} className='btn btn-success'>Save Segment</button>
                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Segment