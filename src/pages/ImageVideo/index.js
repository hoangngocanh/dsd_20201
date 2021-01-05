import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Typography, Table, Progress, DatePicker, Space, TimePicker, Select, Image, Button, Input } from 'antd'

import { columns, data, problemTypes } from './config';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

function ImageVideo() {
    const [imageVideos, setImageVideos] = useState([]);
    const [filterFields, setFilterFields] = useState({
        createdAt: null,
        problemType: 0,
    })
    const [searchString, setSearchString] = useState("");
    const [monitoredObjects, setMonitoredObjects] = useState([]);
    const [droneObjects, setDroneObjects] = useState([]);
    const [currentMonitoredObject, setCurrentMonitoredObject] = useState({});
    const [campaigns, setCampaigns] = useState([]);
    const [currentCampaign, setCurrentCampaign] = useState({});
    const [droneId, setDroneId] = useState();

    const onChangeDate = (date, dateString) => {
        console.log(date, dateString);
        setFilterFields({ ...filterFields, createdAt: dateString });
    }

    const onChangeProblem = (problemType) => {
        console.log("problemType: ", problemType);
        setFilterFields({ ...filterFields, problemType })
    };

    const handleSearch = () => {
        axios({
            method: "POST",
            url: "https://it4483team2.herokuapp.com/api/records/search-image-video",
            params: {
                skip: 0,
                take: 29
            },
            headers: {
                "api-token": localStorage.getItem("token"),
                "project-type": localStorage.getItem("project-type")
            },

            data: {
                title: searchString,
                problemType: filterFields.problemType,
                monitoredObjectId: currentMonitoredObject._id,
                idCampaign: currentCampaign?.value,
            }
        }).then(({ data }) => {
            setImageVideos(data.result.map((i, index) => (
                {
                    ...i,
                    link: i.type === 0 ?
                        <div style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Image
                                width={230}
                                height={150}
                                src={i.link || "error"}
                                fallback="data:image/png;base64,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"
                            />
                        </div> :
                        <video controls src={i.link} style={{
                            height: "150px",
                            width: "230px"
                        }} />,
                    type: i.type === 0 ? "Image" : "Video",
                    problemType: problemTypes[i.problemType],
                    location: <a target="_blank" href={`https://www.google.com/maps/place/${i.latitude},${i.longitude}`} >Xem trên bản đồ</a >
                })));
        })
    };

    const onChangeMonitorObject = monitorObjectId => {
        setCurrentMonitoredObject(monitoredObjects.find(i => i._id === monitorObjectId.key));
    };

    const onChangeDrone = droneId => {
        setDroneId(droneObjects.find(i => i._id === droneId));
    };

    const onChangeCampaign = campaigId => {
        setCurrentCampaign(campaigns.find(i => i._id === campaigId.key));
    };

    useEffect(() => {
        const fetchData = async () => {
            // const res = await axios({
            //     method: "POST",
            //     url: "https://it4483team2.herokuapp.com/api/records/search-image-video",
            //     params: {
            //         skip: 0,
            //         take: 29
            //     },
            //     data: {}
            // });

            const res1 = await axios({
                method: "GET",
                url: "https://dsd05-monitored-object.herokuapp.com/monitored-object/",
                params: {},
                data: {}
            })

            const res2 = await axios({
                method: "GET",
                url: "http://skyrone.cf:6789/drone/getAll",
                params: {},
                data: {}
            })
            axios({
                method: "GET",
                url: "https://dsd05-monitored-object.herokuapp.com/monitored-object/",
                params: {
                    "type": localStorage.getItem("project-type")
                },
                headers: {
                },

                data: {
                }
            }).then((res => {
                const res1Data = (res?.data?.content?.map(i => ({ ...i, value: i._id, label: i.name })));
                setMonitoredObjects(res1Data);
                setCurrentMonitoredObject(res1Data);
            }))

            axios({
                method: "GET",
                url: "http://123.30.235.196:5598/api/monitor-campaigns/",
                params: {
                    "type": localStorage.getItem("project-type"),
                },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                    "projectType": localStorage.getItem("project-type"),
                },

                data: {
                }
            }).then((res => {
                const res1Data = (res?.data?.result?.monitorCampaigns?.map(i => ({ ...i, value: i._id, label: i.name })));
                setCampaigns(res1Data);
                setCurrentCampaign(res1Data);
            }))

            const res2Data = res2.data.map(i => ({ ...i, value: i.id, label: i.name }));
            setDroneObjects(res2Data);
            setDroneId(res2Data[0]);

            // setImageVideos(res.data.result.map((i, index) => ({
            //     ...i,
            //     link: i.type === 0 ?
            //         <Image
            //             width={230}
            //             height={150}
            //             src={i.link || "error"}
            //             fallback="data:image/png;base64,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"
            //         /> :
            //         <video controls src={i.link} style={{
            //             height: "150px",
            //             width: "100%"
            //         }} />,
            //     type: i.type === 0 ? "Image" : "Video",
            //     problemType: problemTypes[i.problemType],
            //     location: <a target="_blank" href={`https://www.google.com/maps/place/${i.latitude},${i.longitude}`} >Xem trên bản đồ</a >
            // })));
        }

        fetchData();
    }, [])

    useEffect(() => {
        handleSearch()
    }, [filterFields])

    return (
        <Container>
            <TitleCustom level={2}>Quản lý hình ảnh, video</TitleCustom>
            <Filter>
                <SpaceCustom>
                    <Space direction="horizontal">
                        <Text>Ngày:</Text>
                        <DatePicker placeholder="Chọn ngày" onChange={onChangeDate} />
                    </Space>
                    {localStorage.getItem("project-type") == "ALL_PROJECT" ?
                        <Space direction="horizontal">
                            <Text>Sự cố:</Text>
                            <Select placeholder="Chọn sự cố" style={{ minWidth: 100 }} allowClear onChange={onChangeProblem}>
                                {[0, 1, 2, 3].map(problemType => <Option value={problemType}>{problemTypes[problemType]}</Option>)}
                            </Select>
                        </Space> : ""}
                    <Space direction="horizontal">
                        <Text>Drone:</Text>
                        <Select
                            value={droneId}
                            labelInValue={true}
                            style={{ minWidth: 100 }}
                            placeholder="Drone giám sát"
                            onChange={onChangeDrone}
                            options={droneObjects.filter((item) => { imageVideos.findIndex((e) => e.droneId == item.id) })}
                        />
                    </Space>
                    <Space direction="horizontal">
                        <Text>Đợt giám sát:</Text>
                        <Select
                            value={currentCampaign}
                            labelInValue={true} style={{ minWidth: 100 }}
                            placeholder="Đợt giám sát"
                            onChange={onChangeCampaign}
                            options={campaigns}
                        />
                    </Space>
                    <Space direction="horizontal">
                        <Text>Đối tượng giám sát:</Text>
                        <Select
                            value={currentMonitoredObject}
                            labelInValue={true} style={{ minWidth: 100 }}
                            placeholder="Đối tượng giám sát"
                            onChange={onChangeMonitorObject}
                            options={monitoredObjects}
                        />
                    </Space>


                </SpaceCustom>

                <SpaceCustom>
                    <Space direction="horizontal">
                        <Input
                            placeholder="Nhập tên tìm kiếm"
                            onChange={(e) => {
                                setSearchString(e.target.value)
                            }} />
                        <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
                    </Space>
                </SpaceCustom>
            </Filter>
            <TableCustom columns={columns} dataSource={imageVideos} onChange={() => { }} pagination />
        </Container >
    )
}

const Filter = styled.div`
    display: flex;
    flex-wrap: wrap;

    & > .ant-select{
        margin-left: auto;
    }
`;

const Container = styled.div`
`;

const TitleCustom = styled(Title)`
    text-align: center;
    padding: 10px 0;
`;

const SpaceCustom = styled(Space)`
    margin-bottom: 10px;
`;

const TableCustom = styled(Table)`
    overflow-x: scroll;
`;

export default ImageVideo;