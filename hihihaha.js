
// ================== set parameter =============================
try {
    var dateNow = getDateInfo();

    setParameter("Day_week", dateNow.day_week);
    setParameter("Day", dateNow.day);
    setParameter("Month", dateNow.month);
    setParameter("Year", dateNow.year);
    setParameter("MH01_12_1", tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.age);

    // BM03 start
    if (!!tw.local.loanApplicationInformation && tw.local.loanApplicationInformation.transactionInfor) {
        setParameter("caseId", getString(tw.local.loanApplicationInformation.transactionInfor.caseID));
    }
    if (!!tw.local.loanApplicationInformation && !!tw.local.loanApplicationInformation.legalInformation) {
        var jobTitleGroupCode = 'TS019';
        var marriageStatusGroupCode = "TS009";
        var positionGroupCode = 'TS184';
        var cardClassGC = 'TS035';
        var annualFeeDiscountGC = 'TS074';

        setParameter("MH01_2_65_DCHT", "");
        setParameter("MH01_2_65_DCTT", "");
        setParameter("MH01_4_64", "");  
        setParameter("MH01_4_65", "");        

        // THÔNG TIN KHÁCH HÀNG
        setParameter("MH01_5_514", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.cifNumber));
        setParameter("MH01_2_01", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.cifNumber));
        setParameter("MH01_2_04", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.accentedFullName));
        setParameter("MH01_2_06", dateToString(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.birthDay));
        var tIdDocs = tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.identificationDocuments;
        for (var i = 0; i < tIdDocs.length; i++) {
            setParameter("MH01_2_19", getString(tIdDocs[i].idNumber));
            setParameter("MH01_2_20", dateToString(tIdDocs[i].issueDate));
            var isIssuePlaceFromT24 = true;
            for (var j = 0; j < tw.local.listIssuePlace.length; j++) {
                if (tIdDocs[i].issuePlace == tw.local.listIssuePlace[j].value) {
                    isIssuePlaceFromT24 = false;
                    setParameter("MH01_2_22", getString(tw.local.listIssuePlace[j].name));
                }
            }
            if (isIssuePlaceFromT24) {
                setParameter("MH01_2_22", getString(tIdDocs[i].issuePlaceName));
            }
            break;
        }
        if (tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList) {
            for (var i = tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList.length - 1; i >= 0; i--) {
                if (tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList[i].addressType == "10") {
                    setParameter("MH01_2_210_DCHT", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList[i].fullAddress));
                } else if (tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList[i].addressType == "02") {
                    setParameter("MH01_2_210_DCTT", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList[i].fullAddress));
                }
            }
        }
        // Khách hàng: Nghề nghiệp & Đơn vị công tác & Chức vụ & Địa chỉ làm việc
        var jobTitle = tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.titleJob;
        setParameter("MH01_2_15", tw.local.mapCategory.get(jobTitle + "_" + jobTitleGroupCode));
        for (var i = 0; i < tw.local.loanApplicationInformation.financeInformation.incomeDetails.length; i++) {
            var isMainIncome = tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isMainIncome
            var incomeType = tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].incomeType;
            if (tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isMainIncome
                && tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isMain
                && !tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isMarriage
            ) {
                if (incomeType == "01") {
                    setParameter("MH01_2_15_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_15_CV", tw.local.mapCategory.get(tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].position + "_" + positionGroupCode));
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        //				if (tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].addressType == '01') {
                        if (j == 0) {
                            setParameter("MH01_2_15_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else if (incomeType == "05") {
                    setParameter("MH01_2_15_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_15_CV", tw.local.mapCategory.get(jobTitle + "_" + jobTitleGroupCode));
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        if (j == 0) {
                            setParameter("MH01_2_15_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else if (incomeType == "06") {
                    setParameter("MH01_2_15_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_15_CV", "Chủ hộ kinh doanh");
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        if (j == 0) {
                            setParameter("MH01_2_15_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else if (incomeType == "07") {
                    setParameter("MH01_2_15_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_15_CV", "Chủ hộ kinh doanh");
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        if (j == 0) {
                            setParameter("MH01_2_15_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else {
                    setParameter("MH01_2_15_DVCT", "");
                    setParameter("MH01_2_15_CV", "");
                    setParameter("MH01_2_15_DCLV", "");
                }
            }
        }

        setParameter("MH01_2_54", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.contactInformation.phoneNumber));
        setParameter("MH01_2_09",
            tw.local.mapCategory.get(
                tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.maritalStatus + "_" + marriageStatusGroupCode));
        setParameter("MH01_2_13", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.dependentNumber));

        // THÔNG TIN VỢ CHỒNG KHÁCH HÀNG
        setParameter("MH01_2_31", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.cifNumber));
        setParameter("MH01_2_35", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.accentedFullName));
        setParameter("MH01_2_36", dateToString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.birthDay));
        setParameter("MH01_2_180", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseContactInformation.phoneNumber));
        var tIdDocs = tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.identificationDocuments;
        for (var i = 0; i < tIdDocs.length; i++) {
            setParameter("MH01_2_44", getString(tIdDocs[i].idNumber));
            setParameter("MH01_2_45", dateToString(tIdDocs[i].issueDate));
            var isIssuePlaceFromT24 = true;
            for (var j = 0; j < tw.local.listIssuePlace.length; j++) {
                if (tIdDocs[i].issuePlace == tw.local.listIssuePlace[j].value) {
                    isIssuePlaceFromT24 = false;
                    setParameter("MH01_2_47", getString(tw.local.listIssuePlace[j].name));
                }
            }
            if (isIssuePlaceFromT24) {
                setParameter("MH01_2_47", getString(tIdDocs[i].issuePlaceName));
            }
            break;
        }
        if (tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList) {
            for (var i = tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList.length - 1; i >= 0; i--) {
                if (tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList[i].addressType == "10") {
                    setParameter("MH01_2_65_DCHT",
                        getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList[i].fullAddress));
                } else if (tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList[i].addressType == "02") {
                    setParameter("MH01_2_65_DCTT",
                        getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList[i].fullAddress));
                }
            }
            setParameter("MH01_2_188", getString(tw.local.loanApplicationInformation.legalInformation.personalInformation.note));
        }
        // Vợ chồng khách hàng: Nghề nghiệp & Đơn vị công tác & Chức vụ & Địa chỉ làm việc
        var spouseJobTitle = tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.titleJob;
        setParameter("MH01_2_178", tw.local.mapCategory.get(spouseJobTitle + "_" + jobTitleGroupCode));
        for (var i = 0; i < tw.local.loanApplicationInformation.financeInformation.incomeDetails.length; i++) {
            // Check thông tin tài chính là của Vợ/chồng người vay chính
            if (!tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isMain
                && tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isMarriage
                && tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isParent
                && !tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isParentChild
                && !tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isTotal) {
                continue;
            }
            var isMainIncome = tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].isMainIncome;
            var incomeType = tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].incomeType;

            if (isMainIncome) {
                if (incomeType == "01") {
                    setParameter("MH01_2_178_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_178_CV", tw.local.mapCategory.get(tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].position + "_" + positionGroupCode));
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        if (j == 0) {
                            setParameter("MH01_2_178_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else if (incomeType == "05") {
                    setParameter("MH01_2_178_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_178_CV", tw.local.mapCategory.get(jobTitle + "_" + jobTitleGroupCode));
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        if (j == 0) {
                            setParameter("MH01_2_178_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else if (incomeType == "06") {
                    setParameter("MH01_2_178_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_178_CV", "Chủ hộ kinh doanh");
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        if (j == 0) {
                            setParameter("MH01_2_178_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else if (incomeType == "07") {
                    setParameter("MH01_2_178_DVCT", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].companyName);
                    setParameter("MH01_2_178_CV", "Chủ hộ kinh doanh");
                    for (var j = 0; j < tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress.length; j++) {
                        if (j == 0) {
                            setParameter("MH01_2_178_DCLV", tw.local.loanApplicationInformation.financeInformation.incomeDetails[i].workAddress[j].fullAddress);
                        }
                    }
                } else {
                    setParameter("MH01_2_178_DVCT", "");
                    setParameter("MH01_2_178_CV", "");
                    setParameter("MH01_2_178_DCLV", "");
                }
            }
        }
    }
    // Hiện trạng quan hệ tín dụng của KH
    if (tw.local.loanApplicationInformation.creditRelationshipHistory
        && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0]
        && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information) {
        var tCreditRes = tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].information;
        if (tCreditRes.creditHistoryAtPVCB) {
            setParameter("MH01_3_15", "+ " + getString(tCreditRes.creditHistoryAtPVCB.notePVCB));
            setParameter("MH01_3_15_2", getString(tCreditRes.creditHistoryAtPVCB.notePVCB));
        }
        if (tCreditRes.creditHistoryAtOtherTCTD) {
            setParameter("MH01_3_33", "+ " + getString(tCreditRes.creditHistoryAtOtherTCTD.noteTCTD));
                        setParameter("MH01_3_33_2", getString(tCreditRes.creditHistoryAtOtherTCTD.noteTCTD));

        }
    }

    // Hiện trạng quan hệ tín dụng của vợ chồng KH
    if (tw.local.loanApplicationInformation.creditRelationshipHistory
        && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married
        && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditRelationshipAtOtherTCTD
        && tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married.creditHistoryAtPVCB) {
        var married = tw.local.loanApplicationInformation.creditRelationshipHistory.items[0].married;
        if (married.creditHistoryAtPVCB) {
            setParameter("MH01_3_15_Spouse", "+ " + getString(married.creditHistoryAtPVCB.notePVCB));
                        setParameter("MH01_3_15_Spouse_2", getString(married.creditHistoryAtPVCB.notePVCB));

        }
        if (married.creditHistoryAtOtherTCTD) {
            setParameter("MH01_3_33_Spouse", "+ " + getString(married.creditHistoryAtOtherTCTD.noteTCTD));
                        setParameter("MH01_3_33_Spouse_2", getString(married.creditHistoryAtOtherTCTD.noteTCTD));

        }
    } else {
        setParameter("MH01_3_15_Spouse", "");
        setParameter("MH01_3_33_Spouse", "");
                setParameter("MH01_3_15_Spouse_2", "");
        setParameter("MH01_3_33_Spouse_2", "");
    }

    // Tài sản
    if (tw.local.loanApplicationInformation.financeInformation.dtiInformation && tw.local.loanApplicationInformation.financeInformation.dtiInformation.dtiResults) {
        for (var i = 0; i < tw.local.loanApplicationInformation.financeInformation.dtiInformation.dtiResults.length; i++) {
            var elem = tw.local.loanApplicationInformation.financeInformation.dtiInformation.dtiResults[i];
            if ("Tổng thu nhập hàng tháng (A)" == elem.indicatorName) {
                setParameter("MH01_5_442", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Tổng thu nhập hàng tháng của khách hàng" == elem.indicatorName) {
                setParameter("MH01_5_443", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Tổng thu nhập hàng tháng của vợ/chồng khách hàng" == elem.indicatorName) {
                setParameter("MH01_5_466", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Tổng thu nhập hàng tháng của người đồng trả nợ" == elem.indicatorName) {
                setParameter("MH01_5_449", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Tổng nghĩa vụ trả nợ hàng tháng (B)" == elem.indicatorName) {
                setParameter("MH01_5_458", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Tổng nghĩa vụ trả nợ hàng tháng các khoản hiện hữu của khách hàng" == elem.indicatorName) {
                setParameter("MH01_5_459", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Tổng nghĩa vụ trả nợ hàng tháng các khoản hiện hữu của vợ/chồng khách hàng" == elem.indicatorName) {
                setParameter("MH01_5_460", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Tổng nghĩa vụ trả nợ hàng tháng khoản đề xuất" == elem.indicatorName) {
                setParameter("MH01_5_461", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Chênh lệch thu nhập và chi phí C=A-B" == elem.indicatorName) {
                setParameter("MH01_5_462", getStringConcat(getStringAsCurrency(elem.value), ' VND'));
            } else if ("Hệ số nghĩa vụ trả nợ trên tổng thu nhập (DTI) = B/A" == elem.indicatorName) {
                setParameter("MH01_5_463", getStringConcat(elem.value, '%'));
            } else if ("Thỏa mãn quy định DTI" == elem.indicatorName) {
                setParameter("THOA_MAN_DTI", getString(elem.dtiResult));
            }
        }
    }
    if (tw.local.loanApplicationInformation.financeInformation.dtiInformation && tw.local.loanApplicationInformation.financeInformation.dtiInformation.dtiComment) {
        for (var i = 0; i < tw.local.loanApplicationInformation.financeInformation.dtiInformation.dtiComment.length; i++) {
            var elem = tw.local.loanApplicationInformation.financeInformation.dtiInformation.dtiComment[i];
            if ("Khách hàng có đủ năng lực trả nợ không" == elem.comment) {
                setParameter("MH01_5_467", getString(elem.value) == '01' ? 'Có' : getString(elem.value) == '02' ? 'Không' : '');
            } else if ("Đánh giá về nguồn thu nhập dùng để trả nợ của khách hàng có ổn định không" == elem.comment) {
                //          setParameter("MH01_5_468", getString(elem.value) === '01' ? "Có" : "Không");
                //          setParameter("MH01_5_469", getString(elem.reason));
            }
        }
    }

    var dtiComment = tw.local.loanApplicationInformation.financeInformation.dtiInformation.dtiComment[1];

    if (dtiComment && dtiComment.value === "01") {
        setParameter("MH01_5_468", "Có");
    } else {
        setParameter("MH01_5_468", "Không");
    }

    setParameter("MH01_5_469", getString(dtiComment.reason));


    // Đánh giá tính tuân thủ
    if (!!tw.local.loanApplicationInformation.complianceEvaluation && !!tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult
        && !!tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion) {
        for (var i = 0; i < tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion.length; i++) {
            var elem = tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion[i];
            var rs = elem.result == "1" ? "Y" : elem.result == "0" ? "N" : "";
            if (rs == "N" && elem.isParent && elem.code != "MH01_8_26") {
                rs = "";
                for (var j = i + 1; j < tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion.length; j++) {
                    var elemJ = tw.local.loanApplicationInformation.complianceEvaluation.assessmentResult.GroupCriterion[j];
                    if (elemJ.indexParent == elem.id && !elemJ.isParent && elemJ.result == "0") {
                        if (rs == "") {
                            rs += elemJ.name;
                        } else {
                            rs += "<br />" + elemJ.name;
                        }
                    } else if (elemJ.indexParent != elem.id) {
                        break;
                    }
                }
            }
            if ("MH01_8_5" == elem.code) {
                setParameter("MH01_8_5", rs);
            } else if ("MH01_8_61" == elem.code) {
                // Mã code trên màn hình và jasper đang khác nhau (61 vs 16)
                setParameter("MH01_8_16", rs);
            } else if ("MH01_8_24" == elem.code) {
                setParameter("MH01_8_24", rs);
            } else if ("MH01_8_26" == elem.code) {
                setParameter("MH01_8_26", rs);
            } else if ("MH01_8_52" == elem.code) {
                setParameter("MH01_8_52", rs);
            } else if ("MH01_8_56" == elem.code) {
                setParameter("MH01_8_56", rs);
            } else if ("MH01_8_60" == elem.code) {
                setParameter("MH01_8_60", rs);
            } else if ("MH01_8_85" == elem.code) {
                setParameter("MH01_8_85", rs);
            } else if ("MH01_8_27" == elem.code) {
                setParameter("MH01_8_27", rs);
            } else if ("MH01_8_37" == elem.code) {
                setParameter("MH01_8_37", rs);
            } else if ("MH01_8_29" == elem.code) {
                setParameter("MH01_8_29", rs);
            } else if ("MH01_8_81" == elem.code) {
                setParameter("MH01_8_31", rs);
            } else if ("MH01_8_33" == elem.code) {
                setParameter("MH01_8_33", rs);
            } else if ("MH01_8_35" == elem.code) {
                setParameter("MH01_8_35", rs);
            } else if ("MH01_8_39" == elem.code) {
                setParameter("MH01_8_39", rs);
            } else if ("MH01_8_41" == elem.code) {
                setParameter("MH01_8_41", rs);
            } else if ("MH01_8_43" == elem.code) {
                setParameter("MH01_8_43", rs);
            } else if ("MH01_8_45" == elem.code) {
                setParameter("MH01_8_45", rs);
            } else if ("MH01_8_48" == elem.code) {
                setParameter("MH01_8_48", rs);
            } else if ("MH01_8_50" == elem.code) {
                setParameter("MH01_8_50", rs);
            }
        }
    }

    if (
        tw.local.loanApplicationInformation.loanPurpose
        && tw.local.loanApplicationInformation.loanPurpose.ClauseLoan
        && tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan
    ) {
        for (var i = 0; i < tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan.length; i++) {
            try {
                var elem = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan[i];
                if (elem.loanPlan != "02") {
                    continue;
                }
                if (elem.creditCardInformationMain.cardType && elem.creditCardInformationMain.cardType.length > 0) {
                    //            setParameter("MH01_4_62", getString(elem.creditCardInformationMain.cardType[0].name));
                }
                setParameter("MH01_4_63", elem.creditCardInformationMain.cardClass);
                setParameter("THOI_HAN_THE_1", getStringConcat(elem.creditCardInformationMain.recommendedCardTerm, ' Tháng'));
                setParameter("MH01_4_65", getStringConcat(elem.creditCardInformationMain.recommendedCardTerm, ' Tháng'));
                setParameter("MH01_4_64", getStringConcat(getStringAsCurrency(decimalToString(elem.creditCardInformationMain.recommendedCardLimit)), ' VND'));
                setParameter("MH01_4_66", elem.creditCardInformationMain.feeIncentives);
            } catch (ex) {
                debug("error---set paremter VuNTN=========>>>" + ex.toString() + " line: " + ex.lineNumber);
            }
            break;
        }
    }

    //Hạn mức thẻ tín dụng đề xuất cùng khoản vay
    var loanPlanListT = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan;
    var index = loanPlanListT.length - 1;
    setParameter("MH01_4_17", getStringConcat(getStringAsCurrency(decimalToString(loanPlanListT[index].loanAmountProposeTotal)), ' VND'));
    var indexTheTinDung = -1; // Khởi tạo mặc định là -1, nghĩa là chưa tìm thấy
    var theTinDung;
    var check = "0";

    for (var i = 0; i < loanPlanListT.length; i++) {
        if (loanPlanListT[i].loanPlan === "02") {
            indexTheTinDung = i;
            theTinDung = loanPlanListT[i];
            if (loanPlanListT[i].RecommendCardIssuance.loanPurposeName == "KH cá nhân vay mua bất động sản thông thường (xét giá trị LTV)") {
                setParameter("loanPlanCheck", "1");
            } else {
                setParameter("loanPlanCheck", "0");
            }
            check = "1";
            break; // Dừng vòng lặp sau khi tìm thấy phần tử đầu tiên
        }
    }

    setParameter("theTinDungCheck", check);

    var loanPlanKetQua = tw.local.loanApplicationInformation.complianceEvaluation.loanPlan;
    if(loanPlanKetQua[indexTheTinDung]){
        setParameter("MH01_8_105", getStringConcat(getStringAsCurrency(decimalToString(loanPlanKetQua[indexTheTinDung].totalLoanAmountInfor.GroupCriterion[0].resultDecimal)), ' VND'));
    } else {
        setParameter("MH01_8_105", getStringConcat("", ' VND'));
    }

    if(indexTheTinDung != -1){
        var cardTypeList = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan[indexTheTinDung].creditCardInformationMain.cardType;
    } else {
        var cardTypeList = [];
    }
    // Mặc định: khởi tạo trạng thái
    var MH01_4_62_3 = "1";
    var MH01_4_62_2 = "1";
    var MH01_4_62_1 = "1";
    var MH01_4_62 = "1";

    for (var i = 0; i < cardTypeList.length; i++) {
        var item = cardTypeList[i];
        if (item.value == "01") {
            MH01_4_62_3 = "1";
            MH01_4_62 = "0";
        } else if (item.value == "02") {
            MH01_4_62_3 = "1";
            MH01_4_62_1 = "0";
        } else if (item.value == "03") {
            MH01_4_62_3 = "1";
            MH01_4_62_2 = "0";
        }
    }

    // Chỉ setParameter 1 lần cho mỗi biến
    setParameter("MH01_4_62_3", MH01_4_62_3);
    setParameter("MH01_4_62_2", MH01_4_62_2);
    setParameter("MH01_4_62_1", MH01_4_62_1);
    setParameter("MH01_4_62", MH01_4_62);

    // Đống hoặc hoặc hoặc ở V.2
    var TSBDList = tw.local.loanApplicationInformation.TSBD.TSBDOther;

    var mucDich;
    var giaTriDinhGia = 0;
    var vayToiDa = 0;
    var ltv = 0;

    for (var i = 0; i < TSBDList.length; i++) {
        var elem = TSBDList[i];
        if (elem.isParent && elem.listTSBDDetailByLoanIncurred) {
            if (
                elem.listTSBDDetailByLoanIncurred[0].purposeLoan &&
                theTinDung &&
                theTinDung.loanPlanCode
            ) {
                for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
                    ltv = elem.listTSBDDetailByLoanIncurred[k].LTVByQD;
                    break;
                }
            }
        }
        break;
    }

    for (var i = 0; i < TSBDList.length; i++) {
        var elem = TSBDList[i];
        if (elem.isParent && elem.listTSBDDetailByLoanIncurred) {
            if (
                elem.listTSBDDetailByLoanIncurred[0].purposeLoan &&
                theTinDung &&
                theTinDung.loanPlanCode
            ) {
                //Bất động sản
                if (elem.TSBDLevel1 == "BatDongSan") {
                    for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
                        var purposeLoanPrefix = elem.listTSBDDetailByLoanIncurred[k].purposeLoan.substring(0, 4);
                        if (purposeLoanPrefix === theTinDung.loanPlanCode) {
                            mucDich = elem.listTSBDDetailByLoanIncurred[k].purposeOfUse;
                            vayToiDa += elem.listTSBDDetailByLoanIncurred[k].loanAmountTSBDByQD;
                            if (elem.listTSBDDetailByLoanIncurred[k].LTVByQD > ltv) {
                                ltv = elem.listTSBDDetailByLoanIncurred[k].LTVByQD;
                            }
                        }
                        for (var j = 0; j < elem.listPricingInfo.length; j++) {
                            if (elem.listPricingInfo[j].convertedLandUsePurposeCode == mucDich) {
                                giaTriDinhGia += elem.listPricingInfo[j].valuetionTotal;
                            }
                        }
                    }
                } else {
                    //Các trường hợp khác
                    for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
                        var purposeLoanPrefix = elem.listTSBDDetailByLoanIncurred[k].purposeLoan.substring(0, 4);
                        if (purposeLoanPrefix === theTinDung.loanPlanCode) {
                            giaTriDinhGia += elem.faceValue;
                            vayToiDa += elem.listTSBDDetailByLoanIncurred[k].loanAmountTSBDByQD;
                            if (elem.listTSBDDetailByLoanIncurred[k].LTVByQD > ltv) {
                                ltv = elem.listTSBDDetailByLoanIncurred[k].LTVByQD
                            }
                        }
                    }
                }


            }
        }
    }

    var TSBDList = tw.local.loanApplicationInformation.TSBD.TSBDMain;

    for (var i = 0; i < TSBDList.length; i++) {
        var elem = TSBDList[i];
        if (elem.isParent && elem.listTSBDDetailByLoanIncurred) {
            if (
                elem.listTSBDDetailByLoanIncurred[0].purposeLoan &&
                theTinDung &&
                theTinDung.loanPlanCode
            ) {
                for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
                    ltv = elem.listTSBDDetailByLoanIncurred[k].LTVByQD;
                    break;
                }
            }
        }
        break;
    }

    for (var i = 0; i < TSBDList.length; i++) {
        var elem = TSBDList[i];
        if (elem.isParent && elem.listTSBDDetailByLoanIncurred) {
            if (
                elem.listTSBDDetailByLoanIncurred[0].purposeLoan &&
                theTinDung &&
                theTinDung.loanPlanCode
            ) {
                //Bất động sản
                if (elem.TSBDLevel1 == "BatDongSan") {
                    for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
                        var purposeLoanPrefix = elem.listTSBDDetailByLoanIncurred[k].purposeLoan.substring(0, 4);
                        if (purposeLoanPrefix === theTinDung.loanPlanCode) {
                            mucDich = elem.listTSBDDetailByLoanIncurred[k].purposeOfUse;
                            vayToiDa += elem.listTSBDDetailByLoanIncurred[k].loanAmountTSBDByQD;
                            if (elem.listTSBDDetailByLoanIncurred[k].LTVByQD > ltv) {
                                ltv = elem.listTSBDDetailByLoanIncurred[k].LTVByQD;
                            }
                        }
                        for (var j = 0; j < elem.listPricingInfo.length; j++) {
                            if (elem.listPricingInfo[j].convertedLandUsePurposeCode == mucDich) {
                                giaTriDinhGia += elem.listPricingInfo[j].valuetionTotal;
                            }
                        }
                    }
                } else {
                    //Các trường hợp khác
                    for (var k = 0; k < elem.listTSBDDetailByLoanIncurred.length; k++) {
                        var purposeLoanPrefix = elem.listTSBDDetailByLoanIncurred[k].purposeLoan.substring(0, 4);
                        if (purposeLoanPrefix === theTinDung.loanPlanCode) {
                            giaTriDinhGia += elem.faceValue;
                            vayToiDa += elem.listTSBDDetailByLoanIncurred[k].loanAmountTSBDByQD;
                            if (elem.listTSBDDetailByLoanIncurred[k].LTVByQD > ltv) {
                                ltv = elem.listTSBDDetailByLoanIncurred[k].LTVByQD
                            }
                        }
                    }
                }


            }
        }
    }

    setParameter("V.2.1", getStringAsCurrency(decimalToString(giaTriDinhGia)));
    setParameter("V.2.2", getStringAsCurrency(decimalToString(vayToiDa)));
    setParameter("V.2.3", decimalToString(ltv));

    if (tw.local.BM03User) {
        setParameter("MH01_4_3", getString(tw.local.BM03User.full_name));
        setParameter("ngay", dateToString(tw.local.BM03User.created_actor_at));
        setParameter("diDong", getString(tw.local.BM03User.phone));
        setParameter("mayLe", getString(tw.local.BM03User.internal_phone));
        setParameter("MH01_4_3_e", getString(tw.local.BM03User.engineer_full_name));
        setParameter("ngay_e", dateToString(tw.local.BM03User.engineer_created_at));
        setParameter("diDong_e", getString(tw.local.BM03User.engineer_phone));
        setParameter("mayLe_e", getString(tw.local.BM03User.engineer_internal_phone));
    } else {
        setParameter("MH01_4_3", "");
        setParameter("ngay", "");
        setParameter("diDong", "");
        setParameter("mayLe", "");
        setParameter("MH01_4_3_e", "");
        setParameter("ngay_e", "");
        setParameter("diDong_e", "");
        setParameter("mayLe_e", "");
    }


    var key_branch = getString(tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.LoanRequest.branchCreated);
    setParameter("MH01_4_2", getString(tw.local.branchName));

    var TSBDCheck = "1";
    for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDMain.length; i++) {
        var elem = tw.local.loanApplicationInformation.TSBD.TSBDMain[i];
        if (!elem.isParent) {
            continue;
        }
        if (!(elem.belongTo == 1)) {
            TSBDCheck = "0";
        }
    }
    for (var i = 0; i < tw.local.loanApplicationInformation.TSBD.TSBDOther.length; i++) {
        var elem = tw.local.loanApplicationInformation.TSBD.TSBDOther[i];
        if (!elem.isParent) {
            continue;
        }
        if (!(elem.belongTo == 1)) {
            TSBDCheck = "0";
        }
    }

    setParameter("TSBDCheck", TSBDCheck);

    setParameter("MH01_4_51", getString(tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.conditionsBeforeDisbur));
    setParameter("MH01_4_52", getString(tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.conditionsAfterDisbur));
    setParameter("MH01_8_61", getKetQuaDanhGia(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.cifNumber, "MH01.8.61"));
    setParameter("MH01_8_69", getKetQuaDanhGia(tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.cifNumber, "MH01.8.69"));

    setParameter("MH01_8_61_Spouse", getKetQuaDanhGia(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.cifNumber, "MH01.8.61"));
    setParameter("MH01_8_69_Spouse", getKetQuaDanhGia(tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.cifNumber, "MH01.8.69"));

	setParameter("coPayerCount", decimalToString(tw.local.loanApplicationInformation.legalInformation.copayerInformation.countCoPayer));
} catch (e) {
    debug("error---set parameter VuNTN=========>>>" + e.toString() + " line: " + e.lineNumber);
}

// BM03 end



//functions=============================>

function dateToString(date) {
    return date != null ? date.format("dd/MM/yyyy", "GMT+07:00") : "";
}

function decimalToString(decimal, indexDec) {
    if (!!decimal && !!indexDec) {
        decimal = decimal.toFixed(indexDec);
    }
    return decimal != null ? decimal.toString() : "0";
}


function dateToText(date) {
    if (date != null) {
        var day = '0' + date.getDate();
        var month = '0' + (date.getMonth() + 1);
        var year = date.getFullYear();

        day = day.slice(-2);
        month = month.slice(-2);

        return "ngày " + day + " tháng " + month + " năm " + year;
    }
    return "";
}

function getString(str) {
    if (typeof str === 'number') {
        return str.toString();
    }
    return !!str ? str : "";
}

/**
 * 
 * @param str: Check null chuỗi này và trả ra
 * @param addStr: Thêm chuỗi này vào sau chuỗi gốc 
 * @returns 
 */
function getStringConcat(str, addStr) {
    if (typeof str === 'number') {
        return str.toString() + addStr;
    }
    return !!str ? str + addStr : "";
}

function getStringAsCurrency(str) {
    if (typeof str === 'number') {
        str = str + '';
    }
    if (/[^0-9-]/.test(str)) {
        return str;
    }
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

function setParameter(key, value) {
    tw.local.baseGendoc.parameters[tw.local.indexP] = {};
    tw.local.baseGendoc.parameters[tw.local.indexP].key = key;
    tw.local.baseGendoc.parameters[tw.local.indexP].value = value;
    tw.local.indexP++;
}

function getDayOfWeek(weekday) {
    var days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    return days[weekday];
}

function getDateInfo() {
    var now = new Date();

    var dayOfWeek = getDayOfWeek(now.getDay());
    var day = String(now.getDate());
    var month = String(now.getMonth() + 1);  // Months are zero-based in JavaScript
    var year = String(now.getFullYear());

    return {
        day_week: dayOfWeek,
        day: day,
        month: month,
        year: year
    };
}

function debug(message, format) {
    if ('DEV' != tw.env.ENV_MODE) return;
    if (!message) return;

    var m = (!!format ? JSON.stringify(message) : message);
    m = m.toJSONString ? m.toJSONString() : (m.toString ? m.toString() : '' + m);
    tw.local.loggingRequests.insertIntoList(tw.local.loggingRequests.listLength, m);
    log.info(tw.system.model.processApp.name + ' >> ' + tw.system.serviceFlow.name + '(' + tw.local.loanApplicationInformation.transactionInfor.caseID + ')' + '\n' + m);
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