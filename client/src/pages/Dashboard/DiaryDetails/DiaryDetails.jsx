import React from "react";
import { useParams } from "react-router-dom";
import Nagarkot from "./Nagarkot";
import Dhulikhel from "./Dhulikhel";
import Bandipur from "./Bandipur";
import Bhedetar from "./Bhedetar";
import Chandragiri from "./Chandragiri";
import Daman from "./Daman";
import Ghandruk from "./Ghandruk";
import Ilam from "./Ilam";
import Jaljala from "./Jaljala";
import Kalinchowk from "./Kalinchowk";
import PoonHill from "./PoonHill";
import Sailung from "./Sailung";
import Sarangkot from "./Sarangkot";
import Shivapuri from "./Shivapuri";
import Tansen from "./Tansen";
import UserDiaryDetail from "./UserDiaryDetail";

const DiaryDetails = () => {
  const { id } = useParams();

  // Load the appropriate diary details based on ID
  const diaryMap = {
    nagarkot: <Nagarkot />,
    dhulikhel: <Dhulikhel />,
    bandipur: <Bandipur />,
    bhedetar: <Bhedetar />,
    chandragiri: <Chandragiri />,
    daman: <Daman />,
    ghandruk: <Ghandruk />,
    ilam: <Ilam />,
    jaljala: <Jaljala />,
    kalinchowk: <Kalinchowk />,
    poonhill: <PoonHill />,
    sailung: <Sailung />,
    sarangkot: <Sarangkot />,
    shivapuri: <Shivapuri />,
    tansen: <Tansen />,
  };

  // Check if static diary entry exists
  if (id && diaryMap[id.toLowerCase()]) {
    return diaryMap[id.toLowerCase()];
  }

  // Fallback to dynamic user diary
  return <UserDiaryDetail />;
};

export default DiaryDetails;
