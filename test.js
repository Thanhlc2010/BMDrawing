try {
  var proTypeGroupCode = 'TS069';
  var proNameGroupCode = 'TS068';
  var debtGrGroupCode = 'TS040';
  var tsbdGC = 'TS095';
  var loanPurposeGroupCode = 'TS031';
  var loanPurposeCardGC = 'TS131';
  var mortgageStatusGC = 'TS090';
  var ngoaiLeKhacGC = 'NGOAI_LE_KHAC';
  var ngoaiLeThamDinh = 'HUONG_DAN_THAM_DINH'

  if (!tw.local.loanApplicationInformation) {
    tw.local.loanApplicationInformation = {};
  }

  if (!tw.local.loanApplicationInformation.VerificationInfo) {
    tw.local.loanApplicationInformation.VerificationInfo = {};
  }

  if (!tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo) {
    tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo = {};
  }

  if (!tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate) {
    tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate = {};
  }

  if (!tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets) {
    tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets = [];
  }

  // BM03 start

  // BM03 - QHTD Khách hàng tại PVcomBank
  var tableData = [];
  if (tw.local.loanApplicationInformation && !!tw.local.loanApplicationInformation.creditRelationshipHistory && !!tw.local.loanApplicationInformation.creditRelationshipHistory.items) {
    if (tw.local.loanApplicationInformation.creditRelationshipHistory.items[0] && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtPVCB && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtPVCB.listLength > 0) {
      for (var i = 0; i < tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtPVCB.length; i++) {
        var elem = tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtPVCB[i];
        var rowData = {};
        rowData["MH01_3_1"] = getString(elem.TCTDNamePVCB);
        rowData["MH01_3_2"] = tw.local.mapCategory.get(elem.productTypePVCB + "_" + 'TS027');
        rowData["MH01_3_3"] = getStringConcat(getStringAsCurrency(elem.limitAmountPVCB), ' VNĐ');
        rowData["MH01_3_4"] = getStringConcat(getStringAsCurrency(elem.outstandingBalancePVCB), ' VNĐ');
        rowData["MH01_3_5"] = tw.local.mapCategory.get(elem.TSBDPVCB + "_" + tsbdGC);
        rowData["MH01_3_6"] = removeM(getStringConcat(getString(elem.loanDurationMonthsPVCB), ' tháng'));
        rowData["MH01_3_7"] = getString(elem.debtGroupPVCB);
        tableData.push(rowData);
      }
    }
  }
  setDatasource("BM03_DS_1", JSON.stringify(tableData));

  var tableData = [];
  var idPatent = '';
  if (tw.local.loanApplicationInformation && tw.local.loanApplicationInformation.complianceEvaluation && tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult) {
    if (tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion && tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion.listLength > 0) {
      for (var i = 0; i < tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion.listLength; i++) {
        var elemPV = tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion[i];
        if (elemPV.isParent && elemPV.code == 'MH01_8_60') {
          idPatent = elemPV.indexParent;
        }
        if (idPatent == elemPV.indexParent && !elemPV.isParent && elemPV.type == 'KH_PV') {
          var rowData = {};
          rowData['tieuChi'] = getString(elemPV.name);
          rowData['danhGia'] = elemPV.result == '1' ? 'Đáp ứng' : 'Không đáp ứng';
          tableData.push(rowData);
        }
      }
    }
  }
  setDatasource("listDanhGia_PV", JSON.stringify(tableData));

  // BM03 - QHTD Khách hàng tại TCTD khác
  tableData = [];
  if (tw.local.loanApplicationInformation.creditRelationshipHistory && tw.local.loanApplicationInformation.creditRelationshipHistory.items && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0] && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtOtherTCTD && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtOtherTCTD.length > 0) {
    for (var i = 0; i < tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtOtherTCTD.length; i++) {
      var elem = tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtOtherTCTD[i];
      var rowData = {};
      rowData["nameTCTDMain"] = getString(elem.TCTDNameTCTD);
      rowData["MH01_3_16"] = tw.local.mapCategory.get(elem.productTypeTCTD + "_" + 'TS069');
      rowData["MH01_3_17"] = getStringConcat(getStringAsCurrency(elem.limitAmountTCTD), ' VNĐ');
      rowData["MH01_3_18"] = getStringConcat(getStringAsCurrency(elem.vndBalance), ' VNĐ');
      if (elem.TSBĐTCTD === 'yes') {
        rowData["MH01_3_19"] = 'Có';
      } else if (i < tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtOtherTCTD.length - 1) {
        rowData["MH01_3_19"] = 'Không';
      } else {
        rowData["MH01_3_19"] = '';
      }
      rowData["MH01_3_20"] = getString(tw.local.mapCategory.get(elem.loanTermTCTD + "_" + 'TS042'));
      rowData["MH01_3_21"] = getString(elem.debtGroupTCTD);
      tableData.push(rowData);
    }
  }
  setDatasource("BM03_DS_2", JSON.stringify(tableData));

  var tableData = [];
  var idPatent = '';
  if (tw.local.loanApplicationInformation && tw.local.loanApplicationInformation.complianceEvaluation && tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult) {
    if (tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion && tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion.listLength > 0) {
      for (var i = 0; i < tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion.listLength; i++) {
        var elemPV = tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion[i];
        if (elemPV.isParent && elemPV.code == 'MH01_8_60') {
          idPatent = elemPV.indexParent;
        }
        if (idPatent == elemPV.indexParent && !elemPV.isParent && elemPV.type == 'KH_TCTD') {
          var rowData = {};
          rowData['tieuChi'] = getString(elemPV.name);
          rowData['danhGia'] = elemPV.result == '1' ? 'Đáp ứng' : 'Không đáp ứng';
          tableData.push(rowData);
        }
      }
    }
  }
  setDatasource("listDanhGia_TCTD", JSON.stringify(tableData));

  // BM03 - QHTD Vợ Chồng Khách hàng tại PVcomBank
  var tableData = [];
  if (tw.local.loanApplicationInformation && !!tw.local.loanApplicationInformation.creditRelationshipHistory && !!tw.local.loanApplicationInformation.creditRelationshipHistory.items) {
    if (tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtPVCB && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtPVCB.listLength > 0) {
      for (var i = 0; i < tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtPVCB.length; i++) {
        var elem = tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtPVCB[i];
        var rowData = {};
        rowData["MH01_3_1"] = getString(elem.TCTDNamePVCB);
        rowData["MH01_3_2"] = tw.local.mapCategory.get(elem.productTypePVCB + "_" + 'TS027');
        rowData["MH01_3_3"] = getStringConcat(getStringAsCurrency(elem.limitAmountPVCB), ' VNĐ');
        rowData["MH01_3_4"] = getStringConcat(getStringAsCurrency(elem.outstandingBalancePVCB), ' VNĐ');
        rowData["MH01_3_5"] = tw.local.mapCategory.get(elem.TSBDPVCB + "_" + tsbdGC);
        rowData["MH01_3_6"] = removeM(getStringConcat(getString(elem.loanDurationMonthsPVCB), ' tháng'));
        rowData["MH01_3_7"] = getString(elem.debtGroupPVCB);
        tableData.push(rowData);
      }
    }
  }
  setDatasource("BM03_DS_Spouse_PV", JSON.stringify(tableData));

  var tableData = [];
  if (tw.local.loanApplicationInformation && !!tw.local.loanApplicationInformation.creditRelationshipHistory && !!tw.local.loanApplicationInformation.creditRelationshipHistory.items) {
    if (tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtOtherTCTD && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtOtherTCTD.listLength > 0) {
      for (var i = 0; i < tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtOtherTCTD.length; i++) {
        var elem = tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtOtherTCTD[i];
        var rowData = {};
        rowData["nameTCTDMain"] = getString(elem.TCTDNameTCTD);
        rowData["MH01_3_16"] = tw.local.mapCategory.get(elem.productTypeTCTD + "_" + 'TS069');
        rowData["MH01_3_17"] = getStringConcat(getStringAsCurrency(elem.limitAmountTCTD), ' VNĐ');
        rowData["MH01_3_18"] = getStringConcat(getStringAsCurrency(elem.vndBalance), ' VNĐ');
        if (elem.TSBĐTCTD === 'yes') {
          rowData["MH01_3_19"] = 'Có';
        } else if (i < tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information.creditRelationshipAtOtherTCTD.length - 1) {
          rowData["MH01_3_19"] = 'Không';
        } else {
          rowData["MH01_3_19"] = '';
        }
        rowData["MH01_3_20"] = getString(tw.local.mapCategory.get(elem.loanTermTCTD + "_" + 'TS042'));
        rowData["MH01_3_21"] = getString(elem.debtGroupTCTD);
        tableData.push(rowData);
      }
    }
  }
  setDatasource("BM03_DS_Spouse_TCTD", JSON.stringify(tableData));

  //End vợ chồng khách hàng

  // Start bảng lịch sử quan hệ tín dụng đồng trả nợ	
  var dsCopayerCreditRelationship = [];
  if (!tw.local.loanApplicationInformation.creditRelationshipHistory) {
    tw.local.loanApplicationInformation.creditRelationshipHistory = {};
  }
  if (!tw.local.loanApplicationInformation.creditRelationshipHistory.items) {
    tw.local.loanApplicationInformation.creditRelationshipHistory.items = [];
  }
  for (var j = 1; j < tw.local.loanApplicationInformation.creditRelationshipHistory.items.length; j++) {
    var row = {};
    var copayer_credit_realtionship = [];
    var copayer_credit_realtionship_2 = [];
    var copayer_credit_realtionship_spouse = [];
    var copayer_credit_realtionship_spouse_2 = [];
    var elem = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j];
    var item_Main_PVCB = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].information.creditRelationshipAtPVCB;
    var item_Main_TCTD = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].information.creditRelationshipAtOtherTCTD;
    var item_Main_Spouse_PVCB = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].married.creditRelationshipAtPVCB;
    var item_Main_Spouse_TCTD = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].married.creditRelationshipAtOtherTCTD;

    if (elem.informationName.substring(0, 42) == "Hiện trạng quan hệ tín dụng của chủ sở hữu") {
      continue;
    }
    // --- KHÁCH HÀNG ---
    for (var i = 0; i < item_Main_PVCB.length; i++) {
      copayer_credit_realtionship.push({
        "tenTCTD": getString(item_Main_PVCB[i].TCTDNamePVCB),
        "loaiSanPham": getString(tw.local.mapCategory.get(item_Main_PVCB[i].productTypePVCB + "_TS027")),
        "hanMucTrenMon": getStringConcat(getStringAsCurrency(item_Main_PVCB[i].limitAmountPVCB), ' VND'),
        "duNo": getStringConcat(getStringAsCurrency(item_Main_PVCB[i].outstandingBalancePVCB), ' VND'),
        "tsbd": getString(tw.local.mapCategory.get(item_Main_PVCB[i].TSBDPVCB + "_TS095")),
        "thoiGianVay": getStringConcat(getString(item_Main_PVCB[i].loanDurationMonthsPVCB), ' Tháng'),
        "nhomNo": getString(item_Main_PVCB[i].debtGroupPVCB)
      });
    }
    for (var i = 0; i < item_Main_TCTD.length; i++) {
      copayer_credit_realtionship_2.push({
        "tenTCTD": getString(item_Main_TCTD[i].TCTDNameTCTD),
        "loaiSanPham": getString(tw.local.mapCategory.get(item_Main_TCTD[i].productTypeTCTD + "_TS069")),
        "hanMucTrenMon": getStringConcat(getStringAsCurrency(item_Main_TCTD[i].limitAmountTCTD), ' VND'),
        "duNo": getStringConcat(getStringAsCurrency(item_Main_TCTD[i].vndBalance), ' VND'),
        "tsbd": item_Main_TCTD[i].TSBĐTCTD === "yes" ? "có" : (item_Main_TCTD[i].TSBĐTCTD == null ? "" : "không"),
        "thoiGianVay": getStringConcat(getString(tw.local.mapCategory.get(item_Main_TCTD[i].loanTermTCTD + "_TS042")), ' Tháng'),
        "nhomNo": getString(item_Main_TCTD[i].debtGroupTCTD)
      });
    }
    row.MH01_8_61 = getKetQuaDanhGia(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifNumber, "MH01.8.61");
    row.MH01_8_69 = getKetQuaDanhGia(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifNumber, "MH01.8.69");
    row.MH01_8_77 = getKetQuaDanhGia(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifNumber, "MH01.8.77");
    row.cif = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifNumber;
    row.ten = getNameCoPayer(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifNumber);

    // --- VỢ/CHỒNG ---
    if (tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifMarried) {
      row.isMarriage = true;
      for (var i = 0; i < item_Main_Spouse_PVCB.length; i++) {
        copayer_credit_realtionship_spouse.push({
          "tenTCTD": getString(item_Main_Spouse_PVCB[i].TCTDNamePVCB),
          "loaiSanPham": getString(tw.local.mapCategory.get(item_Main_Spouse_PVCB[i].productTypePVCB + "_TS027")),
          "hanMucTrenMon": getStringConcat(getStringAsCurrency(item_Main_Spouse_PVCB[i].limitAmountPVCB), ' VND'),
          "duNo": getStringConcat(getStringAsCurrency(item_Main_Spouse_PVCB[i].outstandingBalancePVCB), ' VND'),
          "tsbd": getString(tw.local.mapCategory.get(item_Main_Spouse_PVCB[i].TSBDPVCB + "_TS095")),
          "thoiGianVay": getStringConcat(getString(item_Main_Spouse_PVCB[i].loanDurationMonthsPVCB), ' Tháng'),
          "nhomNo": getString(item_Main_Spouse_PVCB[i].debtGroupPVCB)
        });
      }
      for (var i = 0; i < item_Main_Spouse_TCTD.length; i++) {
        copayer_credit_realtionship_spouse_2.push({
          "tenTCTD": getString(item_Main_Spouse_TCTD[i].TCTDNameTCTD),
          "loaiSanPham": getString(tw.local.mapCategory.get(item_Main_Spouse_TCTD[i].productTypeTCTD + "_TS069")),
          "hanMucTrenMon": getStringConcat(getStringAsCurrency(item_Main_Spouse_TCTD[i].limitAmountTCTD), ' VND'),
          "duNo": getStringConcat(getStringAsCurrency(item_Main_Spouse_TCTD[i].vndBalance), ' VND'),
          "tsbd": item_Main_Spouse_TCTD[i].TSBĐTCTD === "yes" ? "có" : (item_Main_Spouse_TCTD[i].TSBĐTCTD == null ? "" : "không"),
          "thoiGianVay": getString(tw.local.mapCategory.get(item_Main_Spouse_TCTD[i].loanTermTCTD + "_TS042")),
          "nhomNo": getString(item_Main_Spouse_TCTD[i].debtGroupTCTD)
        });
      }

      row.MH01_8_61_Spouse = getKetQuaDanhGia(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifMarried, "MH01.8.61");
      row.MH01_8_69_Spouse = getKetQuaDanhGia(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifMarried, "MH01.8.69");
      row.MH01_8_77_Spouse = getKetQuaDanhGia(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifMarried, "MH01.8.77");
      row.cifSpouse = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifMarried;
      row.tenSpouse = getNameSpouseCoPayer(tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].cifMarried);
    } else {
      row.isMarriage = false;
    }
    // Lấy các giá trị từ các đối tượng
    var married = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].married;

    // Xử lý ghi chú chính (ghiChu)
    var notePVCB_Main = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].information.creditHistoryAtPVCB ?
      tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].information.creditHistoryAtPVCB.notePVCB : null;

    var noteTCTD_Main = tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].information.creditHistoryAtOtherTCTD ?
      tw.local.loanApplicationInformation.creditRelationshipHistory.items[j].information.creditHistoryAtOtherTCTD.noteTCTD : null;

    row.MH01_3_15 = getString(notePVCB_Main);
    row.MH01_3_33 = getString(noteTCTD_Main);

    // Xử lý ghi chú cho spouse (ghiChuSpouse)
    var notePVCB_Spouse = married && married.creditHistoryAtPVCB ? married.creditHistoryAtPVCB.notePVCB : null;
    var noteTCTD_Spouse = married && married.creditHistoryAtOtherTCTD ? married.creditHistoryAtOtherTCTD.noteTCTD : null;

    row.MH01_3_15_Spouse = getString(notePVCB_Spouse);
    row.MH01_3_33_Spouse = getString(noteTCTD_Spouse);



    row.listCreditRelationshipCopayer = copayer_credit_realtionship;
    row.listCreditRelationshipCopayer_2 = copayer_credit_realtionship_2;
    row.listCreditRelationshipCopayerSpouse = copayer_credit_realtionship_spouse;
    row.listCreditRelationshipCopayerSpouse_2 = copayer_credit_realtionship_spouse_2;
    dsCopayerCreditRelationship[dsCopayerCreditRelationship.length] = row;
  }
  setDatasource("dsCopayerCreditRelationship", JSON.stringify(dsCopayerCreditRelationship));
  // end bảng lịch sử quan hệ tín dụng đồng trả nợ

  // BM03 - Bảng Nhận xét người đồng trả nợ
  var tableData = [];
  if (!tw.local.loanApplicationInformation.legalInformation.copayerInformation) {
    tw.local.loanApplicationInformation.legalInformation.copayerInformation = {};
  }
  if (!tw.local.loanApplicationInformation.legalInformation.copayerInformation.copayerList) {
    tw.local.loanApplicationInformation.legalInformation.copayerInformation.copayerList = [];
  }

  var coPayerList = tw.local.loanApplicationInformation.legalInformation.copayerInformation.copayerList;
  var creditRelationshipHistoryList = tw.local.loanApplicationInformation.creditRelationshipHistory.items;
  for (var i = 0; i < coPayerList.length; i++) {
    var elem = coPayerList[i];
    var rowData = {};
    rowData["index"] = decimalToString(i + 2);
    rowData["isMarried"] = getString(elem.personalCustomerInformation.maritalStatus);

    rowData["MH01_2_158"] = getString(elem.note);
    rowData["MH01_2_70"] = getString(elem.personalCustomerInformation.fullName);
    rowData["MH01_2_69"] = getString(elem.personalCustomerInformation.cifNumber);
    rowData["MH01_3_15"] = "";
    rowData["MH01_3_33"] = "";

    if (elem.personalCustomerInformation.maritalStatus == "MARRIED") {
      rowData["MH01_2_84"] = getString(elem.customerSpouseInformation.fullName);
      rowData["MH01_2_81"] = getString(elem.customerSpouseInformation.cifNumber);

      rowData["MH01_3_15_Spouse"] = "";
      rowData["MH01_3_33_Spouse"] = "";
    }

    // Tìm credit history trùng cifNumber
    var cif = elem.personalCustomerInformation.cifNumber;
    for (var j = 0; j < creditRelationshipHistoryList.length; j++) {
      var creditItem = creditRelationshipHistoryList[j];
      if (creditItem.cifNumber === cif) {
        // Tìm thấy phần tử trùng cifNumber
        // Thực hiện hành động cần thiết với creditItem, ví dụ:
        rowData["MH01_3_15"] = "+ " + getString(creditItem.information.creditHistoryAtPVCB.notePVCB);
        rowData["MH01_3_33"] = "+ " + getString(creditItem.information.creditHistoryAtOtherTCTD.noteTCTD);

        if (creditItem.married) {
          if (creditItem.married.creditHistoryAtPVCB) {
            rowData["MH01_3_15_Spouse"] = "+ " + getString(creditItem.married.creditHistoryAtPVCB.notePVCB);
          }
          if (creditItem.married.creditHistoryAtOtherTCTD) {
            rowData["MH01_3_33_Spouse"] = "+ " + getString(creditItem.married.creditHistoryAtOtherTCTD.noteTCTD);
          }
        }
        break; // Dừng nếu chỉ cần phần tử đầu tiên trùng
      }
    }

    tableData.push(rowData);
  }
  setDatasource("BM03_Comment_CoPayer", JSON.stringify(tableData));
  // BM03 - END Bảng Nhận xét người đồng trả nợ

  // BM03 - Bảng phương án cấp tín dụng

  var tableData = [];
  if (!tw.local.loanApplicationInformation.loanPurpose.ClauseLoan) {
    tw.local.loanApplicationInformation.loanPurpose.ClauseLoan = {};
  }
  if (!tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan) {
    tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan = [];
  }

  var loanPlanListT = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan;

  for (var i = 0; i < loanPlanListT.length - 1; i++) {
    var elem = loanPlanListT[i];
    var rowData = {};
    rowData["maPhuongAn"] = getString(elem.loanPlanCode);
    if (elem.durationLoanRecomend) {
      rowData["thoiHanCapTinDung"] = getStringConcat(integerToString(elem.durationLoanRecomend), ' Tháng');
    } else {
      rowData["thoiHanCapTinDung"] = getStringConcat(integerToString(elem.creditCardInformationMain.recommendedCardTerm), ' Tháng');
    }
    rowData["thoiHanRutVon"] = getString("");
    rowData["laiSuatPhiDieuChinh"] = getString("");

    if (elem.loanPlan == "01") {
      rowData["MH01_4_15"] = getStringConcat(getStringAsCurrency(elem.loanAmountPropose), ' VND');
      rowData["MH01_4_11"] = getString(tw.local.mapCategory.get(elem.product + "_" + "TS024"));
      rowData["MH01_4_48"] = getString(tw.local.mapCategory.get(elem.methodDisbur + "_" + "TS030"));
      //			rowData["MH01_4_41"] = getString(tw.local.mapCategory.get(("0" + (getString(elem.repaymentPeriod))) + "_" + "TS073"));
      var tempCode = "0" + (getString(elem.repaymentPeriod));
      rowData["MH01_4_41"] = getString(tw.local.mapCategory.get(tempCode + "_" + "TS073"));
      rowData["MH01_4_42"] = getString(elem.paymentOfInterest);
      rowData["MH01_4_43"] = getString(elem.graceInterest);
      rowData["MH01_4_44"] = getString(elem.graceOrigin);
    } else if (elem.loanPlan == "02") {
      //	      	if (!elem.RecommendCardIssuance) elem.RecommendCardIssuance = {};
      if (!elem.creditCardInformationMain) elem.creditCardInformationMain = {};
      rowData["MH01_4_15"] = getStringConcat(getStringAsCurrency(elem.creditCardInformationMain.recommendedCardLimit), ' VND');
      rowData["MH01_4_11"] = getString(tw.local.mapCategory.get(elem.product + "_" + "TS024"));
      rowData["MH01_4_48"] = getString("");
      rowData["MH01_4_41"] = getString("");
      rowData["MH01_4_42"] = getString("");
      rowData["MH01_4_43"] = getString("");
      rowData["MH01_4_44"] = getString("");
    }

    rowData["listTSBD"] = getTSBDThanhlc(elem.loanPlanCode);
    tableData.push(rowData);
  }
  setDatasource("BM03_DS_PACTD", JSON.stringify(tableData));

  // BM03 - END Bảng phương án cấp tín dụng

  // BM03 - Bảng Phương án vay vốn
  tableData = [];
  for (var i = 0; i < tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan.length; i++) {
    try {
      var rowData = {};
      var elem = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan[i];
      if (!elem.loanPurposeName) {
        continue;
      }
      rowData["MH01_4_110"] = getString(tw.local.mapCategory.get(elem.product + "_" + "TS024"));
      rowData["MH01_4_24"] = getString(elem.loanPurposeName);
      rowData["MH01_4_40"] = getStringConcat(getString(elem.durationLoanRecomend), ' tháng');
      rowData["MH01_4_32"] = getStringConcat(getString(elem.minimumCapitalRatio), '%');
      rowData["MH01_4_13"] = getStringConcat(getStringAsCurrency(elem.valueBDSTransferred), ' VND');
      rowData["MH01_4_30"] = getStringConcat(getStringAsCurrency(elem.loanAmountPropose ? elem.loanAmountPropose
        : elem.creditCardInformationMain ? elem.creditCardInformationMain.recommendedCardLimit : ''), ' VND');
      var fullAdress = '';
      if (elem.addressList) {
        fullAdress = elem.addressList.fullAddress;
      } else {
        fullAdress = elem.AddressReceiveCardAndPIN
          && elem.AddressReceiveCardAndPIN.addressList ? elem.AddressReceiveCardAndPIN.addressList.fullAddress : '';
      }
      rowData["MH01_4_37"] = getString(fullAdress);
      rowData["MH01_4_54"] = getString(tw.local.mapCategory.get(elem.consistentWithMarket + "_" + "TS038"));
      rowData["MH01_4_55"] = getString(tw.local.mapCategory.get(elem.appropSituationCustomer + "_" + "TS039"));
      rowData["MH01_4_56"] = getString(elem.note);
    } catch (ex) {
      log.error("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
    tableData.push(rowData);
  }
  setDatasource("BM03_DS_PAVV", JSON.stringify(tableData));

  // BM03 - Bảng Tài sản bảo đảm

  //Bất động sản
  tableData = [];
  var securedAssets = tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets;
  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDMain.length; i++) {
    //Tài sản bảo đảm đồng thời là phương án vay
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDMain[i];
      if (!elem.isParent) {
        continue;
      }
      if (!(elem.TSBDLevel1 == 'BatDongSan')) {
        continue;
      }

      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      for (var o = 0; o < elem.listPricingInfo.length; o++) {
        giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
        TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      }
      for (var o = 0; o < elem.listTSBDDetailByLoanIncurred.length; o++) {
        vayToiDa += elem.listTSBDDetailByLoanIncurred[o].loanAmountTSBDByQD;
        vayDVKD += elem.listTSBDDetailByLoanIncurred[o].loanAmountTSBDByDVKDProposal;
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(giaTriDinhGia)), ' VND');
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(TSBDConLai)), ' VND');
      rowData["sanPham"] = "";
      rowData["ltv"] = "";
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = "";
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');




      if (elem.TSBDLevel1 == 'BatDongSan' && elem.listPricingInfo && elem.listPricingInfo.length) {
        // Chi tiết BĐS theo khoản vay phát sinh với TSBD là BĐS sẽ hiện trên dòng riêng
        tableData.push(rowData);
        for (var j = 0; j < elem.listPricingInfo.length; j++) {
          var elemTier2 = elem.listPricingInfo[j];
          rowData = {};
          var mucDich = getString(elemTier2.purposeuUseConvertedLand);
          rowData["maTaiSan"] = getString(mucDich + '_' + "TS003");
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.valuetionTotal)), ' VND');
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.adjustedRemainingAssetValue)), ' VND');
          var count = 0;
          var ltv = 0;
          var ltvDVKD = 0;
          var vayToiDa = 0;
          var vayDVKD = 0;

          if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
            ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
            ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
            for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
              var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
              if (elemTier3.purposeOfUse == mucDich) {
                count++;
                if (elemTier3.LTVByQD > ltv) {
                  ltv = elemTier3.LTVByQD;
                }
                if (elemTier3.LTVDVKDProposal > ltvDVKD) {
                  ltvDVKD = elemTier3.LTVDVKDProposal;
                }
                vayToiDa += elemTier3.loanAmountTSBDByQD;
                vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;

              }
            }
          }

          // if (count > 1) {
          if (false) {
            rowData["sanPham"] = "";
          } else {
            rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[j].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[j].purposeLoan;
          }
          // rowData["ltv"] = decimalToString(ltv);
          rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          // rowData["vayToiDa"] = decimalToString(vayToiDa);
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD)), ' VND');
          // rowData["ltvDVKD"] = decimalToString(ltvDVKD);
          rowData["ltvDVKD"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal), " %");
          // rowData["vayDVKD"] = decimalToString(vayDVKD);
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal)), ' VND');



          if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
            // for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
            var elemTier3 = elem.listTSBDDetailByLoanIncurred[j];
            // var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];  

            // if (elemTier3.purposeOfUse == mucDich) {
            tableData.push(rowData);
            rowData = {};
            rowData["maTaiSan"] = mucDich;
            rowData["chuSoHuu"] = "";
            rowData["quanHeCSHvoiKH"] = "";
            rowData["tinhTrangPhapLy"] = "";
            rowData["tinhTrangKhoanVayKHKhac"] = "";
            rowData["giaTriDinhGia"] = "";
            rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier3.remainingAssetValue)), ' VND');
            rowData["sanPham"] = getSanPhamTSBD(elemTier3.purposeLoan) + " - " + elemTier3.purposeLoan;
            rowData["ltv"] = getStringConcat(decimalToString(elemTier3.LTVByQD), " %");
            rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier3.loanAmountTSBDByQD)), ' VND');
            rowData["ltvDVKD"] = getStringConcat(decimalToString(elemTier3.LTVDVKDProposal), " %");
            rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier3.loanAmountTSBDByDVKDProposal)), ' VND');
            // }
            // }
          }
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }

  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDOther.length; i++) {
    //Tài sản bảo đảm khác
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDOther[i];
      if (!elem.isParent) {
        continue;
      }

      if (!(elem.TSBDLevel1 == 'BatDongSan')) {
        continue;
      }

      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      for (var o = 0; o < elem.listPricingInfo.length; o++) {
        giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
        TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      }
      for (var o = 0; o < elem.listTSBDDetailByLoanIncurred.length; o++) {
        vayToiDa += elem.listTSBDDetailByLoanIncurred[o].loanAmountTSBDByQD;
        vayDVKD += elem.listTSBDDetailByLoanIncurred[o].loanAmountTSBDByDVKDProposal;
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(giaTriDinhGia)), ' VND');
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(TSBDConLai)), ' VND');
      rowData["sanPham"] = "";
      rowData["ltv"] = "";
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = "";
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');

      if (elem.listPricingInfo && elem.listPricingInfo.length) {
        // Chi tiết BĐS theo khoản vay phát sinh với TSBD là BĐS sẽ hiện trên dòng riêng
        tableData.push(rowData);
        for (var j = 0; j < elem.listPricingInfo.length; j++) {
          var elemTier2 = elem.listPricingInfo[j];
          rowData = {};
          var mucDich = elemTier2.convertedLandUsePurposeCode;
          rowData["maTaiSan"] = getString(mucDich + '_' + "TS003");
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.valuetionTotal)), ' VND');
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.adjustedRemainingAssetValue)), ' VND');
          var count = 0;
          var ltv = 0;
          var ltvDVKD = 0;
          var vayToiDa = 0;
          var vayDVKD = 0;

          if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
            ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
            ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
            for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
              var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
              if (elemTier3.purposeOfUseName == mucDich) {
                count++;
                if (elemTier3.LTVByQD > ltv) {
                  ltv = elemTier3.LTVByQD;
                }
                if (elemTier3.LTVDVKDProposal > ltvDVKD) {
                  ltvDVKD = elemTier3.LTVDVKDProposal;
                }
                vayToiDa += elemTier3.loanAmountTSBDByQD;
                vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;
              }
            }
            for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
              var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
              if (elemTier3.purposeOfUseName == mucDich) {
                          if (count > 1) {
                            // if (false) {
                            rowData["sanPham"] = "";
                          } else {
                            rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[z].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[z].purposeLoan;
                          }
              }
            }
          }
          rowData["ltv"] = getStringConcat(decimalToString(ltv), " %");
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
          rowData["ltvDVKD"] = getStringConcat(decimalToString(ltvDVKD), " %");
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');

          // rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          // rowData["vayToiDa"] = decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD);
          // rowData["ltvDVKD"] = decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal);
          // rowData["vayDVKD"] = decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal);



          if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
            for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
              // var elemTier3 = elem.listTSBDDetailByLoanIncurred[j];
              var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];

              if (elemTier3.purposeOfUse == mucDich) {
                tableData.push(rowData);
                rowData = {};
                rowData["maTaiSan"] = mucDich;
                rowData["chuSoHuu"] = "";
                rowData["quanHeCSHvoiKH"] = "";
                rowData["tinhTrangPhapLy"] = "";
                rowData["tinhTrangKhoanVayKHKhac"] = "";
                rowData["giaTriDinhGia"] = "";
                rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier3.remainingAssetValue)), ' VND');
                rowData["sanPham"] = getSanPhamTSBD(elemTier3.purposeLoan) + " - " + elemTier3.purposeLoan;
                rowData["ltv"] = getStringConcat(decimalToString(elemTier3.LTVByQD), " %");
                rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier3.loanAmountTSBDByQD)), ' VND');
                rowData["ltvDVKD"] = getStringConcat(decimalToString(elemTier3.LTVDVKDProposal), " %");
                rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier3.loanAmountTSBDByDVKDProposal)), ' VND');
              }
            }
          }
          else {
            log.info("Khác không có tier 3");
          }
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }
  // if (tableData.length == 0) {
  //   tableData.push({});
  // }
  setDatasource("TSBD_BatDongSan", JSON.stringify(tableData));

  //Giấy tờ có giá do pv
  tableData = [];
  var securedAssets = tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets;
  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDMain.length; i++) {
    //Tài sản bảo đảm đồng thời là phương án vay
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDMain[i];
      if (!elem.isParent) {
        continue;
      }

      if (!(elem.TSBDLevel2 == 'GiayToCoGia_PVComPhatHanh')) {
        continue;
      }

      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      var ltv = 0;
      var count = 0;
      // for (var o = 0; o < elem.listPricingInfo.length; o++) {
      //   giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
      //   TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      // }

      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
        ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
        for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
          var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
          count++;
          if (elemTier3.LTVByQD > ltv) {
            ltv = elemTier3.LTVByQD;
          }
          if (elemTier3.LTVDVKDProposal > ltvDVKD) {
            ltvDVKD = elemTier3.LTVDVKDProposal;
          }
          vayToiDa += elemTier3.loanAmountTSBDByQD;
          vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;
          TSBDConLai += elemTier3.remainingAssetValue;

        }
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elem.faceValue)), ' VND');
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.adjustedResidualValue)), ' VND');
      if (count > 1) {
        // if (false) {
        rowData["sanPham"] = "";
      } else {
        rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[0].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[0].purposeLoan;
      }
      rowData["ltv"] = "";
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = "";
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');




      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        if( count > 1){
          tableData.push(rowData);
          rowData = {};
          rowData["maTaiSan"] = "";
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = "";

        }
        for (var j = 0; j < elem.listTSBDDetailByLoanIncurred.length; j++) {
          var elemTier2 = elem.listTSBDDetailByLoanIncurred[j];
          var mucDich = elemTier2.purposeOfUse;
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.remainingAssetValue)), ' VND');
          // var count = 0;
          // var ltv = 0;
          // var ltvDVKD = 0;
          // var vayToiDa = 0;
          // var vayDVKD = 0;

          rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[j].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[j].purposeLoan;
          // // rowData["ltv"] = decimalToString(ltv);
          rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          // // rowData["vayToiDa"] = decimalToString(vayToiDa);
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD)), ' VND');
          // // rowData["ltvDVKD"] = decimalToString(ltvDVKD);
          rowData["ltvDVKD"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal), " %");
          // // rowData["vayDVKD"] = decimalToString(vayDVKD);
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal)), ' VND');
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }

  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDOther.length; i++) {
    //Tài sản bảo đảm khác
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDOther[i];
      if (!elem.isParent) {
        continue;
      }

      if (!(elem.TSBDLevel2 == 'GiayToCoGia_PVComPhatHanh')) {
        continue;
      }

      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        log.info("không tìm thấy matchedasset");
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      var ltv = 0;
      var count = 0;
      var ltvDVKD = 0;
      // for (var o = 0; o < elem.listPricingInfo.length; o++) {
      //   giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
      //   TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      // }

      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
        ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
        for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
          var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
          count++;
          if (elemTier3.LTVByQD > ltv) {
            ltv = elemTier3.LTVByQD;
          }
          if (elemTier3.LTVDVKDProposal > ltvDVKD) {
            ltvDVKD = elemTier3.LTVDVKDProposal;
          }
          vayToiDa += elemTier3.loanAmountTSBDByQD;
          vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;
          TSBDConLai += elemTier3.remainingAssetValue;
        }
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elem.faceValue)), ' VND');
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.adjustedResidualValue)), ' VND');
      if (count > 1) {
        // if (false) {
        rowData["sanPham"] = "";
      } else {
        rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[0].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[0].purposeLoan;
      }
      rowData["ltv"] = getStringConcat(decimalToString(ltv), " %");
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = getStringConcat(decimalToString(ltvDVKD), " %");
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');




      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        if(count > 1){
          tableData.push(rowData);
          rowData = {};
          rowData["maTaiSan"] = "";
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = "";  
        }
        for (var j = 0; j < elem.listTSBDDetailByLoanIncurred.length; j++) {
          var elemTier2 = elem.listTSBDDetailByLoanIncurred[j];
          var mucDich = elemTier2.purposeOfUse;
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.remainingAssetValue)), ' VND');
          rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[j].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[j].purposeLoan;
          rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD)), ' VND');
          rowData["ltvDVKD"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal), " %");
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal)), ' VND');
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }
  // if (tableData.length == 0) {
  //   tableData.push({});
  // }
  setDatasource("TSBD_GiayToCoGiaPVPhatHanh", JSON.stringify(tableData));

  //Giấy tờ có giá không do pv
  tableData = [];
  var securedAssets = tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets;
  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDMain.length; i++) {
    //Tài sản bảo đảm đồng thời là phương án vay
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDMain[i];
      if (!elem.isParent) {
        continue;
      }

      if (!(elem.TSBDLevel2 == 'GiayToCoGia_KhongDoPVComPhatHanh')) {
        continue;
      }

      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      var ltv = 0;
      var count = 0;
      // for (var o = 0; o < elem.listPricingInfo.length; o++) {
      //   giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
      //   TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      // }

      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
        ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
        for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
          var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
          count++;
          if (elemTier3.LTVByQD > ltv) {
            ltv = elemTier3.LTVByQD;
          }
          if (elemTier3.LTVDVKDProposal > ltvDVKD) {
            ltvDVKD = elemTier3.LTVDVKDProposal;
          }
          vayToiDa += elemTier3.loanAmountTSBDByQD;
          vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;
          TSBDConLai += elemTier3.remainingAssetValue;

        }
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elem.faceValue)), ' VND');
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.adjustedResidualValue)), ' VND');
      if (count > 1) {
        // if (false) {
        rowData["sanPham"] = "";
      } else {
        rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[0].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[0].purposeLoan;
      }
      rowData["ltv"] = "";
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = "";
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');




      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        if(count > 1){
          tableData.push(rowData);
          rowData = {};
          rowData["maTaiSan"] = "";
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = "";
        }
        for (var j = 0; j < elem.listTSBDDetailByLoanIncurred.length; j++) {
          var elemTier2 = elem.listTSBDDetailByLoanIncurred[j];
          var mucDich = elemTier2.purposeOfUse;
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.remainingAssetValue)), ' VND');

          rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[j].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[j].purposeLoan;
          // // rowData["ltv"] = decimalToString(ltv);
          rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          // // rowData["vayToiDa"] = decimalToString(vayToiDa);
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD)), ' VND');
          // // rowData["ltvDVKD"] = decimalToString(ltvDVKD);
          rowData["ltvDVKD"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal), " %");
          // // rowData["vayDVKD"] = decimalToString(vayDVKD);
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal)), ' VND');
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }

  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDOther.length; i++) {
    //Tài sản bảo đảm khác
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDOther[i];
      if (!elem.isParent) {
        continue;
      }

      if (!(elem.TSBDLevel2 == 'GiayToCoGia_KhongDoPVComPhatHanh')) {
        continue;
      }

      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      var ltv = 0;
      var count = 0;
      var ltvDVKD = 0;
      // for (var o = 0; o < elem.listPricingInfo.length; o++) {
      //   giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
      //   TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      // }

      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
        ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
        for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
          var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
          count++;
          if (elemTier3.LTVByQD > ltv) {
            ltv = elemTier3.LTVByQD;
          }
          if (elemTier3.LTVDVKDProposal > ltvDVKD) {
            ltvDVKD = elemTier3.LTVDVKDProposal;
          }
          vayToiDa += elemTier3.loanAmountTSBDByQD;
          vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;
          TSBDConLai += elemTier3.remainingAssetValue;
        }
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elem.faceValue)), ' VND');
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.adjustedResidualValue)), ' VND');
      if (count > 1) {
        // if (false) {
        rowData["sanPham"] = "";
      } else {
        rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[0].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[0].purposeLoan;
      }
      rowData["ltv"] = getStringConcat(decimalToString(ltv), " %");
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = getStringConcat(decimalToString(ltvDVKD), " %");
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');




      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        if(counnt > 1){
          tableData.push(rowData);
          rowData = {};
          rowData["maTaiSan"] = "";
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = "";
        }
        for (var j = 0; j < elem.listTSBDDetailByLoanIncurred.length; j++) {
          var elemTier2 = elem.listTSBDDetailByLoanIncurred[j];
          var mucDich = elemTier2.purposeOfUse;
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.remainingAssetValue)), ' VND');
          rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[j].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[j].purposeLoan;
          rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD)), ' VND');
          rowData["ltvDVKD"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal), " %");
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal)), ' VND');
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }
  setDatasource("TSBD_GiayToCoGiaKhongPVPhatHanh", JSON.stringify(tableData));

  //Phương tiện giao thông
  tableData = [];
  var securedAssets = tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets;
  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDMain.length; i++) {
    //Tài sản bảo đảm đồng thời là phương án vay
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDMain[i];
      if (!elem.isParent) {
        continue;
      }

      if (!(elem.TSBDLevel1 === 'PhuongTienGiaoThong' || elem.TSBDLevel1 === 'TauThuyen')) {
        continue;
      }


      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      var ltv = 0;
      var count = 0;
      // for (var o = 0; o < elem.listPricingInfo.length; o++) {
      //   giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
      //   TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      // }

      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
        ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
        for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
          var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
          count++;
          if (elemTier3.LTVByQD > ltv) {
            ltv = elemTier3.LTVByQD;
          }
          if (elemTier3.LTVDVKDProposal > ltvDVKD) {
            ltvDVKD = elemTier3.LTVDVKDProposal;
          }
          vayToiDa += elemTier3.loanAmountTSBDByQD;
          vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;
          TSBDConLai += elemTier3.remainingAssetValue;
        }
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elem.valuationValue)), ' VND');
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.adjustedResidualValue)), ' VND');
      if (count > 1) {
        // if (false) {
        rowData["sanPham"] = "";
      } else {
        rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[0].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[0].purposeLoan;
      }
      rowData["ltv"] = "";
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = "";
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');

      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        if(count > 1) {
          tableData.push(rowData);
          rowData = {};
          // var mucDich = elemTier2.purposeOfUse;
          rowData["maTaiSan"] = "";
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = "";
        }
        for (var j = 0; j < elem.listTSBDDetailByLoanIncurred.length; j++) {
          var elemTier2 = elem.listTSBDDetailByLoanIncurred[j];
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.remainingAssetValue)), ' VND');
          // var count = 0;
          // var ltv = 0;
          // var ltvDVKD = 0;
          // var vayToiDa = 0;
          // var vayDVKD = 0;

          rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[j].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[j].purposeLoan;
          // // rowData["ltv"] = decimalToString(ltv);
          rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          // // rowData["vayToiDa"] = decimalToString(vayToiDa);
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD)), ' VND');
          // // rowData["ltvDVKD"] = decimalToString(ltvDVKD);
          rowData["ltvDVKD"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal), " %");
          // // rowData["vayDVKD"] = decimalToString(vayDVKD);
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal)), ' VND');
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }

  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDOther.length; i++) {
    //Tài sản bảo đảm khác
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.TSBD.TSBDOther[i];
      if (!elem.isParent) {
        continue;
      }

      if (!(elem.TSBDLevel1 === 'PhuongTienGiaoThong' || elem.TSBDLevel1 === 'TauThuyen')) {
        continue;
      }


      var matchedAsset = null;
      for (var p = 0; p < securedAssets.length; p++) {
        if (securedAssets[p].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[p];
        }
      }

      var MH01_6_1 = getString(elem.AssetCode);
      if (matchedAsset) {
        var MH01_6_6 = getString(matchedAsset.loaiTSBD2Name);
      } else {
        var MH01_6_6 = getString("");
      }
      var MH01_6_54 = getString(tw.local.mapCategory.get(getString(elem.documentType) + '_' + "TS004"));
      var MH01_6_55 = getString(elem.GCQNumber);
      var MH01_6_56 = dateToString(elem.issueDate);
      var MH01_6_57 = getString(elem.issuePlace);
      var maTaiSan = MH01_6_1 + " - " + MH01_6_6 + " - " + MH01_6_54 + " số " + MH01_6_55 + ", ngày cấp" + MH01_6_56 + ", nơi cấp " + MH01_6_57;
      rowData["maTaiSan"] = maTaiSan;
      rowData["chuSoHuu"] = getString(elem.ownerNameTSBD);
      rowData["quanHeCSHvoiKH"] = getString(elem.ownerStatus);
      rowData["tinhTrangPhapLy"] = tw.local.mapCategory.get(getString(elem.MortgageStatus) + '_' + mortgageStatusGC);
      rowData["tinhTrangKhoanVayKHKhac"] = "";
      var giaTriDinhGia = 0;
      var TSBDConLai = 0;
      var vayToiDa = 0;
      var vayDVKD = 0;
      var ltv = 0;
      var count = 0;
      var ltvDVKD = 0;
      // for (var o = 0; o < elem.listPricingInfo.length; o++) {
      //   giaTriDinhGia += elem.listPricingInfo[o].valuetionTotal;
      //   TSBDConLai += elem.listPricingInfo[o].adjustedRemainingAssetValue;
      // }

      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        ltv = elem.listTSBDDetailByLoanIncurred[0].LTVByQD;
        ltvDVKD = elem.listTSBDDetailByLoanIncurred[0].LTVDVKDProposal;
        for (var z = 0; z < elem.listTSBDDetailByLoanIncurred.length; z++) {
          var elemTier3 = elem.listTSBDDetailByLoanIncurred[z];
          count++;
          if (elemTier3.LTVByQD > ltv) {
            ltv = elemTier3.LTVByQD;
          }
          if (elemTier3.LTVDVKDProposal > ltvDVKD) {
            ltvDVKD = elemTier3.LTVDVKDProposal;
          }
          vayToiDa += elemTier3.loanAmountTSBDByQD;
          vayDVKD += elemTier3.loanAmountTSBDByDVKDProposal;
          TSBDConLai += elemTier3.remainingAssetValue;
        }
      }
      rowData["giaTriDinhGia"] = getStringConcat(getStringAsCurrency(decimalToString(elem.valuationValue)), ' VND');;
      rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.adjustedResidualValue)), ' VND');
      if (count > 1) {
        // if (false) {
        rowData["sanPham"] = "";
      } else {
        rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[0].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[0].purposeLoan;
      }
      rowData["ltv"] = getStringConcat(decimalToString(ltv), " %");
      rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(vayToiDa)), ' VND');
      rowData["ltvDVKD"] = getStringConcat(decimalToString(ltvDVKD), " %");
      rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(vayDVKD)), ' VND');




      if (elem.listTSBDDetailByLoanIncurred && elem.listTSBDDetailByLoanIncurred.length) {
        if(count > 1){
          tableData.push(rowData);
          rowData = {};
          // var mucDich = elemTier2.purposeOfUse;
          rowData["maTaiSan"] = "";
          rowData["chuSoHuu"] = "";
          rowData["quanHeCSHvoiKH"] = "";
          rowData["tinhTrangPhapLy"] = "";
          rowData["tinhTrangKhoanVayKHKhac"] = "";
          rowData["giaTriDinhGia"] = "";
        }
        for (var j = 0; j < elem.listTSBDDetailByLoanIncurred.length; j++) {
          var elemTier2 = elem.listTSBDDetailByLoanIncurred[j];
          rowData["giaTriTSBDConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elemTier2.remainingAssetValue)), ' VND');
          rowData["sanPham"] = getSanPhamTSBD(elem.listTSBDDetailByLoanIncurred[j].purposeLoan) + " - " + elem.listTSBDDetailByLoanIncurred[j].purposeLoan;
          rowData["ltv"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVByQD), " %");
          rowData["vayToiDa"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByQD)), ' VND');
          rowData["ltvDVKD"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[j].LTVDVKDProposal), " %");
          rowData["vayDVKD"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[j].loanAmountTSBDByDVKDProposal)), ' VND');
          tableData.push(rowData);
        }
      } else {
        tableData.push(rowData);
      }
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
  }
  setDatasource("TSBD_PhuongTienVanTai", JSON.stringify(tableData));

  // BM03 - Đánh giá tính tuân thủ các quy định khác (Ngoại lệ)
  tableData = [];
  if (tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.productExceptions) {
    for (var i = 0; i < tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.productExceptions.length; i++) {
      var rowData = {};
      try {
        var elem = tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.productExceptions[i];
        rowData["tieuChi"] = getString(elem.name);
        rowData["ngoaiLe"] = "";
        rowData["trichDanQuyDinh"] = "";
        rowData["lyDo"] = "Không đáp ứng quy định";
      } catch (e) {
        debug("error---set datasources VuNTN=========>>>" + e.toString() + " line: " + e.lineNumber);
      }
      tableData.push(rowData);
    }
    for (var i = 0; i < tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.otherExceptions.length; i++) {
      var rowData = {};
      try {
        var elem = tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.otherExceptions[i];
        rowData["tieuChi"] = tw.local.mapCategory.get(elem.criteria + "_" + ngoaiLeKhacGC);
        rowData["ngoaiLe"] = getString(elem.descriptionContent);
        rowData["trichDanQuyDinh"] = getString(elem.document);
        rowData["lyDo"] = "Không đáp ứng quy định";
      } catch (e) {
        debug("error---set datasources VuNTN=========>>>" + e.toString() + " line: " + e.lineNumber);
      }
      tableData.push(rowData);
    }
    if (tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.appraisalDifferences && tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.appraisalDifferences.listLength) {
      for (var i = 0; i < tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.appraisalDifferences.listLength; i++) {
        var elem = tw.local.loanApplicationInformation.complianceEvaluation.exceptionInfor.appraisalDifferences[i]
        var rowData = {};
        rowData["tieuChi"] = tw.local.mapCategory.get(elem.criteria + "_" + ngoaiLeThamDinh);
        rowData["ngoaiLe"] = getString(elem.descriptionContent);
        rowData["trichDanQuyDinh"] = "122/2022/HD-KHCN";
        rowData["lyDo"] = "Không đáp ứng quy định";
        tableData.push(rowData);
      }
    }

  }
  setDatasource("BM03_DS_NGOAILE", JSON.stringify(tableData));

  // BM03 - Đánh giá tính tuân thủ các điều kiện cấp tín dụng...
  tableData = [];
  if (tw.local.loanApplicationInformation.otherInfomation.BO_EvaluateComplanceCredit) {
    for (var i = 0; i < tw.local.loanApplicationInformation.otherInfomation.BO_EvaluateComplanceCredit.length; i++) {
      var rowData = {};
      try {
        var elem = tw.local.loanApplicationInformation.otherInfomation.BO_EvaluateComplanceCredit[i];
        var elemValue = elem.value == '01' ? 'Y' : elem.value == '02' ? 'N' : '';
        rowData["MH01_7_27"] = getString(elem.target);
        rowData["MH01_7_28"] = getString(elemValue);
      } catch (ex) {
        log.error("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
      }
      tableData.push(rowData);
    }
  }
  setDatasource("BM03_DS_NOIBO", JSON.stringify(tableData));

  // BM03 - Bảng đề xuất cấp tín dụng
  tableData = [];
  for (var i = 0; i < tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan.length; i++) {
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan[i];
      if (!elem.loanPurposeName) {
        continue;
      }
      rowData["MH01_4_11"] = getString(elem.loanPurposeName);
      rowData["MH01_8_105"] = getStringConcat(getStringAsCurrency(elem.loanAmountPropose ? elem.loanAmountPropose
        : elem.creditCardInformationMain ? elem.creditCardInformationMain.recommendedCardLimit : ''), ' VND');
      rowData["MH01_8_88"] = getStringConcat(getString(elem.durationLoanRecomend ? elem.durationLoanRecomend
        : elem.creditCardInformationMain ? elem.creditCardInformationMain.recommendedCardTerm : ''), ' tháng');
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
    tableData.push(rowData);
  }
  setDatasource("BM03_DS_DX_CAP_TD", JSON.stringify(tableData));

  //Tài sản bảo đảm level2
  tableData = [];
  for (var i = 0; i < tw.local.loanApplicationInformation.financeInformation.assetData.length; i++) {
    var rowData = {};
    try {
      var elem = tw.local.loanApplicationInformation.financeInformation.assetData[i];
      
      row["giaTri"] = getStringConcat(getStringAsCurrency(decimalToString(elem.assetValue)), ' VND');
    } catch (ex) {
      debug("error---set datasources VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
    }
    tableData.push(rowData);
  }
  setDatasource("BM03_TSBDLevel2", JSON.stringify(tableData));



} catch (e) {
  //	tw.local.test = "error---set datasources VuNTN=========>>>" + e.toString() + " line: " + e.lineNumber;
  log.info("error---set datasources VuNTN=========>>>" + e.toString() + " line: " + e.lineNumber);
}


// BM03 end

// tw.local.capitalUseDetails = new tw.object.listOf.CapitalUseDetail_GD_Base();
// if(tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail){
// 	for(var i=0;i<tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail.listLength;i++){
// 		tw.local.capitalUseDetails[i] = new tw.object.CapitalUseDetail_GD_Base();
// 		tw.local.capitalUseDetails[i].stt = (i+1).toString();
// 		tw.local.capitalUseDetails[i].MH01_2_131 = tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail[i].Purpose;
// 		tw.local.capitalUseDetails[i].MH01_2_132 = formatDecimal(decimalToString(tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail[i].ContractCreditValue));
// 		tw.local.capitalUseDetails[i].MH01_2_133 = formatDecimal(decimalToString(tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail[i].SecureAssetsValue));
// 		tw.local.capitalUseDetails[i].MH01_2_134 = formatDecimal(decimalToString(tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail[i].ContractCreditUsed));
// 		tw.local.capitalUseDetails[i].MH01_2_135 = formatDecimal(decimalToString(tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail[i].SecureAssetsUsed));
// 		tw.local.capitalUseDetails[i].MH01_2_136 = formatDecimal(decimalToString(tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail[i].RemainSecureAssets));
// 		tw.local.capitalUseDetails[i].MH01_2_137 = formatDecimal(decimalToString(tw.local.disbursementApprove.CustomerInfor.CapitalUseInformationDetail.ListCapitalUseDetail[i].RemainContractCredit));
// 	}
// }
function getTSBDThanhlc(loanPlanCode) {
  if (
    tw.local &&
    tw.local.loanApplicationInformation &&
    tw.local.loanApplicationInformation.VerificationInfo &&
    tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo &&
    tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate &&
    tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets
  ) {
    securedAssets = tw.local.loanApplicationInformation.VerificationInfo.expertiseInfo.evaluate.securedAssets;
  } else {
    return [];
  }

  var tableData = [];
  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDMain.length; i++) {
    //Tài sản bảo đảm đồng thời là phương án vay
    var rowData = {};
    var elem = tw.local.loanApplicationInformation.TSBD.TSBDMain[i];
    if (elem.isParent) {
      var matchedAsset = null;
      for (var j = 0; j < securedAssets.length; j++) {
        if (securedAssets[j].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[j];
          break;
        }
      }

      for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
        var rowData = {};
        var purposeLoanPrefix = elem.listTSBDDetailByLoanIncurred[k].purposeLoan.substring(0, 4);
        rowData["loanPlanCode"] = purposeLoanPrefix;
        if (!(purposeLoanPrefix == loanPlanCode)) {
          continue;
        }
        rowData["taiSanBaoDam"] = getString(elem.AssetCode);

        if (elem.TSBDLevel1 == "BatDongSan") {
          if (elem.listPricingInfo && elem.listPricingInfo[k] && elem.listPricingInfo.length) {
            rowData["mucDich"] = getString(elem.listPricingInfo[k].purposeuUseConvertedLand);
          }
        } else {
          rowData["mucDich"] = "";
        }
        rowData["taiSanConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[k].remainingAssetValue)), ' VND');
        rowData["LTV"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[k].LTVDVKDProposal), ' %');
        tableData.push(rowData);
      }
    }
  }

  for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDOther.length; i++) {
    // Thông tin Tài sản bảo đảm khác
    var rowData = {};
    var elem = tw.local.loanApplicationInformation.TSBD.TSBDOther[i];
    if (elem.isParent) {
      var matchedAsset = null;
      for (var j = 0; j < securedAssets.length; j++) {
        if (securedAssets[j].assetCodeDocumentNumber === elem.AssetCode) {
          matchedAsset = securedAssets[j];
          break;
        }
      }
      for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
        var rowData = {};
        var purposeLoanPrefix = elem.listTSBDDetailByLoanIncurred[k].purposeLoan.substring(0, 4);
        rowData["loanPlanCode"] = purposeLoanPrefix;
        if (!(purposeLoanPrefix == loanPlanCode)) {
          continue;
        }
        rowData["taiSanBaoDam"] = getString(elem.AssetCode);

        if (elem.TSBDLevel1 == "BatDongSan") {
          if (elem.listPricingInfo && elem.listPricingInfo.length) {
            rowData["mucDich"] = getString(elem.listPricingInfo[k].purposeuUseConvertedLand);
          } else {
            rowData["mucDich"] = getString(elem.listTSBDDetailByLoanIncurred[k].purposeOfUseName);
          }
        } else {
          rowData["mucDich"] = "";
        }
        rowData["taiSanConLai"] = getStringConcat(getStringAsCurrency(decimalToString(elem.listTSBDDetailByLoanIncurred[k].remainingAssetValue)), ' VND');
        rowData["LTV"] = getStringConcat(decimalToString(elem.listTSBDDetailByLoanIncurred[k].LTVDVKDProposal), ' %');
        tableData.push(rowData);
      }

    }
  }

  return tableData;
}


function setTimeZone(str) {
  var releaseDate = new tw.object.Date();
  releaseDate.parse(str, 'dd/MM/yyyy HH:mm:ss', "GMT+07:00");
  return releaseDate;
}

function dateToString(date) {
  return date != null ? date.format("dd/MM/yyyy", "GMT+07:00") : "";
}

function decimalToString(decimal, indexDec) {
  if (!!decimal && !!indexDec) {
    decimal = decimal.toFixed(indexDec);
  }
  return decimal != null ? decimal.toString() : "0";
}

function decimalToString2(decimal, index) {
  return decimal != null ? decimal.toFixed(index).toString() : "0";
}

function setTofixed(dec, index) {
  if (!!dec) {
    return dec.toFixed(index);
  }
  return dec;
}

function rateChange(dec, buy, sell) {
  dec = dec || 1;
  buy = buy || 1;
  sell = sell || 1;

  return (dec * sell) / buy;
}

function dateToText(date) {
  if (date != null) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return "ngày " + day + " tháng " + month + " năm " + year;
  }
  return "";

}

function getBank(bankCode) {
  var bankName = "";
  if (!!tw.local.bankList && tw.local.bankList.listLength > 0) {
    for (var i = 0; i < tw.local.bankList.listLength; i++) {
      if (bankCode == tw.local.bankList[i].name) {
        bankName = tw.local.bankList[i].value;
        break;
      }
    }
  }
  return bankName;
}

function getBranchBank(branchCode) {
  var bankName = "";
  if (!!tw.local.branchBankList && tw.local.branchBankList.listLength > 0) {
    for (var i = 0; i < tw.local.branchBankList.listLength; i++) {
      if (branchCode == tw.local.branchBankList[i].name) {
        bankName = tw.local.branchBankList[i].value;
        break;
      }
    }
  }

  if (!!tw.local.bdsList && tw.local.bdsList.listLength > 0 && bankName == "") {
    for (var i = 0; i < tw.local.bdsList.listLength; i++) {
      if (branchCode == tw.local.bdsList[i].name) {
        bankName = tw.local.bdsList[i].value;
        break;
      }
    }
  }
  return bankName;
}

function setStatus(code) {
  if (code == "DQH") {
    return "Đã quá hạn";
  } else if (code == "CDH") {
    return "Chưa đến hạn";
  } else if (code == "DTHMP") {
    return "Đã thực hiện một phần";
  } else if (code == "CNTDTH") {
    return "Chi nhánh theo dõi thực hiện";
  } else if (code == "DTH") {
    return "Đã thực hiện";
  }
  return "";
}

function setProductCredit(code) {
  if (code == "TTTP") {
    return "Thanh toán TP";
  } else if (code == "GNTP") {
    return "GN trái phiếu";
  } else if (code == "CV") {
    return "Cho vay";
  } else if (code == "CK") {
    return "Chiết khấu";
  } else if (code == "LC") {
    return "Cho vay thanh toán LC";
  } else if (code == "VK") {
    return "Khác";
  } else {
    return "";
  }
}

function getString(str) {
  if (typeof str === 'number') {
    return str.toString();
  }
  return !!str ? str : "";
}

function getStringConcat(str, addStr) {
  if (typeof str === 'number') {
    return str.toString() + addStr;
  }
  return !!str ? str + addStr : "";
}

function getStringAsCurrency(str) {
  if (typeof str === 'number') {
    str = str.toString();
  }

  var num = Number(str);
  if (isNaN(num)) return str;

  var isNegative = num < 0;
  var numberPart = Math.abs(num).toFixed(0);

  var formatted = numberPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return isNegative ? "-" + formatted : formatted;
}

function setDatasource(key, value) {
  tw.local.baseGendoc.dataSources[tw.local.indexD] = new tw.object.MapCustom();
  tw.local.baseGendoc.dataSources[tw.local.indexD].key = key;
  tw.local.baseGendoc.dataSources[tw.local.indexD].value = value;
  tw.local.indexD++;
}

function getKetQuaDanhGia(cifNumber, code) {
  // Kiểm tra nếu loanApplicationInformation hoặc các thuộc tính liên quan bị null/undefined
  if (!tw ||
    !tw.local ||
    !tw.local.loanApplicationInformation ||
    !tw.local.loanApplicationInformation.complianceEvaluation ||
    !tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult ||
    !tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion) {
    return "";
  }

  var GroupCriterionList = tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion;

  // Duyệt qua danh sách GroupCriterion
  for (var i = 0; i < GroupCriterionList.length; i++) {
    var item = GroupCriterionList[i];

    // Kiểm tra null/undefined cho từng item và so sánh
    if (item && item.code === code && item.CIFNumber === cifNumber) {
      log.info(i);
      return item.result || ""; // Trả về kết quả nếu có, nếu không trả về chuỗi rỗng
    }
  }

  return ""; // Trả về chuỗi rỗng nếu không tìm thấy
}

function formatDecimal(decimal) {
  var chars;
  var charP1s;
  var str = '';
  try {
    chars = decimal.split('.');
    var p1 = decimal;
    var p2 = '';
    if (chars.length == 2) {
      p1 = chars[0];
      p2 = chars[1];
    }

    charP1s = p1.split('');
    var index = 0;
    for (var i = charP1s.length - 1; i >= 0; i--) {
      if (index % 3 == 0 && index != 0) {
        str = '.' + str;
      }
      str = charP1s[i] + str;
      index++;
    }
    if (chars.length == 2) {
      if (p2.length == 1) {
        p2 = p2 + '0';
      }
      str = str + ',' + p2;
    }
  } catch (e) {
    str = decimal;
  }
  return str;
}

function removeM(str) {
  return str.trim().replace(/M$/, '');
}

function getTSBD(typeTSBD) {
  if (typeTSBD == 'yes') {
    return 'Có';
  } else if (typeTSBD == 'no') {
    return 'Không có';
  } else {
    return '';
  }
}

function debug(message, format) {
  if ('DEV' != tw.env.ENV_MODE) return;
  if (!message) return;

  var m = (!!format ? JSON.stringify(message) : message);
  m = m.toJSONString ? m.toJSONString() : (m.toString ? m.toString() : '' + m);
  tw.local.loggingRequests.insertIntoList(tw.local.loggingRequests.listLength, m);
  log.info(tw.system.model.processApp.name + ' >> ' + tw.system.serviceFlow.name + '(' + tw.local.loanApplicationInformation.transactionInfor.caseID + ')' + '\n' + m);
}

function integerToString(integer) {
  return integer != null ? integer.toString() : "";
}

function getSanPhamTSBD(purposeLoan) {
  var purposeLoanPrefix = purposeLoan.substring(0, 4);
  for (var i = 0; i < tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan.length; i++) {
    var elem = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan[i];
    if (purposeLoanPrefix == elem.loanPlanCode) {
      return (getString(tw.local.mapCategory.get(elem.product + "_" + "TS024")))
    }
  }
}

function getNameCoPayer(cif) {
  var list = tw.local.loanApplicationInformation.legalInformation.copayerInformation.copayerList;
  for (var i = 0; i < list.length; i++) {
    var elem = list[i];
    if (elem.personalCustomerInformation.cifNumber == cif) {
      return elem.personalCustomerInformation.accentedFullName;
    }
  }
}

function getNameSpouseCoPayer(cif) {
  var list = tw.local.loanApplicationInformation.legalInformation.copayerInformation.copayerList;
  for (var i = 0; i < list.length; i++) {
    var elem = list[i];
    if (elem.customerSpouseInformation.cifNumber == cif) {
      return elem.customerSpouseInformation.accentedFullName;
    }
  }
}


