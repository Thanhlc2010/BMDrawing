try {
	//	tw.local.listIdentificationVoChong = tw.local.listIdentification;
		
	
		if (!tw.local.MB02A) {
			tw.local.MB02A = {};
		}
		if(!tw.local.MB02A.generalInformation){
			tw.local.MB02A.generalInformation = {};
		}
		if(!tw.local.MB02A.bankSide){
			tw.local.MB02A.bankSide = {};
		}
		
		if(!tw.local.MB02A.bankSide.MB02C_BankTable){
			tw.local.MB02A.bankSide.MB02C_BankTable = [];
		}
		
		if(!tw.local.MB02A.transferor){
			tw.local.MB02A.transferor = {};
		}
		if(!tw.local.MB02A.borrower){
			tw.local.MB02A.borrower = {};
		}
		if(!tw.local.MB02A.borrower.informationCustomer){
			tw.local.MB02A.borrower.informationCustomer = {};
		}
		if(!tw.local.MB02A.borrower.informationCustomerSpouse){
			tw.local.MB02A.borrower.informationCustomerSpouse = {};
		}
		if(!tw.local.MB02A.generalTerms){
			tw.local.MB02A.generalTerms = {};
		}
		if(!tw.local.MB02A.generalTerms.tableAsset){
			tw.local.MB02A.generalTerms.tableAsset = [];
		}
		if(!tw.local.MB02A.disbursement){
			tw.local.MB02A.disbursement = {};
		}
	//	if(!tw.local.MB02A.articles){
	//		tw.local.MB02A.articles = {};
	//	}
	//	if(!tw.local.MB02A.articles.article1){
	//		tw.local.MB02A.articles.article1 = {};
	//	}
	//	if(!tw.local.MB02A.articles.article1.article1Table){
	//		tw.local.MB02A.articles.article1.article1Table = [];
	//	}
		
		
	//	var TDCN01 =  tw.local.profileApproval.drafProfileInformation.listCreditContractProfile[0].TDCN01;
		var TDCN01 = tw.local.profileApproval.drafProfileInformation.drafProfileSelected.profileDraftDetail.TDCN01;
		debugger;
		
		
		if (TDCN01.isBorrower){
			tw.local.MB02A.generalInformation.loanOption = (TDCN01.benVayKhachHang.Title === '02' ? "Bà" : "Ông") + " " + TDCN01.benVayKhachHang.name + " cùng " + (TDCN01.benVayKhachHang.Title === '02' ? "Bà" : "Ông")  + " " + TDCN01.benVayVoChongKhachHang.name;
		} else{
			tw.local.MB02A.generalInformation.loanOption = (TDCN01.benVayKhachHang.Title === '02' ? "Bà" : "Ông")  + " " + TDCN01.benVayKhachHang.name;
		}
		
		
		tw.local.MB02A.generalInformation.between = tw.local.MB02A.generalInformation.loanOption;
		tw.local.MB02A.generalInformation.creditContractCustomer = tw.local.MB02A.generalInformation.loanOption;
		tw.local.MB02A.generalInformation.creditContract = TDCN01.generalInformation.number;
		tw.local.MB02A.generalInformation.creditContractBetween = TDCN01.benChoVay.branch;
		tw.local.MB02A.bankSide.branchCode_key = TDCN01.benChoVay.branch;
		tw.local.MB02A.bankSide.bankAddress_key = TDCN01.benChoVay.address;
		tw.local.MB02A.bankSide.bankCode_key = TDCN01.benChoVay.businessIdentificationNumber;
		tw.local.MB02A.bankSide.bankPhone_key = TDCN01.benChoVay.phone;
		tw.local.MB02A.bankSide.DanhXungDaiDien = TDCN01.benChoVay.legalRepresentativeTitle;
		
		if (TDCN01.benChoVay && Array.isArray(TDCN01.benChoVay.benChoVayList)) {
			for (var i = 0; i < TDCN01.benChoVay.benChoVayList.length; i++) {
				tw.local.MB02A.bankSide.MB02C_BankTable[i] = {};
				tw.local.MB02A.bankSide.MB02C_BankTable[i].id = "MB02A_BankTable" + i;
				tw.local.MB02A.bankSide.MB02C_BankTable[i].UyQuyenSo = TDCN01.benChoVay.benChoVayList[i].authorizationDocumentNumber;
				tw.local.MB02A.bankSide.MB02C_BankTable[i].date = TDCN01.benChoVay.benChoVayList[i].authorizationDate;
				tw.local.MB02A.bankSide.MB02C_BankTable[i].Issuer = TDCN01.benChoVay.benChoVayList[i].documentIssuer;
			}
		} else {
			console.error("TDCN01.benChoVay.benChoVayList is undefined or not an array");
		}
		debugger;
		
		if (tw.local.branchInfo && tw.local.branchInfo.length > 0) {
			if(tw.local.branchInfo[0]){
				tw.local.MB02A.bankSide.bankFax_key = getString(tw.local.branchInfo[0].fax);
			}
		}
		
		if(TDCN01.benVayKhachHang.Title || TDCN01.benVayKhachHang.name || TDCN01.benVayKhachHang.identificationNumber 
			|| TDCN01.benVayKhachHang.placeOfIssue || TDCN01.benVayKhachHang.dateOfIssue || TDCN01.benVayKhachHang.permanentAddress 
			|| TDCN01.benVayKhachHang.phone || TDCN01.isBorrower
			|| TDCN01.benVayVoChongKhachHang.Title
			|| TDCN01.benVayVoChongKhachHang.name
			|| TDCN01.benVayVoChongKhachHang.phone
			|| TDCN01.benVayVoChongKhachHang.documentType
			|| TDCN01.benVayVoChongKhachHang.identificationNumber
			|| TDCN01.benVayVoChongKhachHang.placeOfIssue
			|| TDCN01.benVayVoChongKhachHang.dateOfIssue
			|| TDCN01.benVayVoChongKhachHang.permanentAddress
	
		){
	
			tw.local.MB02A.borrower.informationCustomer.designation = TDCN01.benVayKhachHang.Title;
			tw.local.MB02A.borrower.informationCustomer.fullName = TDCN01.benVayKhachHang.name;
			tw.local.MB02A.borrower.informationCustomer.identificationNumber = TDCN01.benVayKhachHang.identificationNumber;
			
			tw.local.MB02A.borrower.informationCustomer.issuePlace = TDCN01.benVayKhachHang.placeOfIssue;
			tw.local.MB02A.borrower.informationCustomer.issueDate = TDCN01.benVayKhachHang.dateOfIssue;
			tw.local.MB02A.borrower.informationCustomer.permanentResidenceAddress = TDCN01.benVayKhachHang.permanentAddress;
			
	
			var listAddress = tw.local.loanApplicationInformation.legalInformation.personalInformation.addressList;
			for(var i = 0; i < listAddress.length; i++){
				if(listAddress[i].addressType === '03'){
					tw.local.MB02A.borrower.informationCustomer.currentResidenceAddress = listAddress[i].fullAddress;
				}
			}
			
			var listIdentification1 = [];
	
			// Duyệt qua danh sách copayerList để lấy idType (list 3)
			for (var i = 0; i < tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.identificationDocuments.length; i++) {
				var idTypeValue = tw.local.loanApplicationInformation.legalInformation.personalInformation.personalCustomerInformation.identificationDocuments[i].idType;
			
				// Tìm trong listIdentification (list 2) xem có name nào tương ứng với value không
				for (var j = 0; j < tw.local.listIdentification.length; j++) {
					if (tw.local.listIdentification[j].value === idTypeValue) {
						// Nếu tìm thấy, thêm vào listIdentification1
						listIdentification1.push({
							name: tw.local.listIdentification[j].name,
							value: idTypeValue
						});
						break; // Thoát vòng lặp khi tìm thấy
					}
				}
			}
			
			tw.local.listIdentification = listIdentification1;
			
			tw.local.MB02A.borrower.informationCustomer.phone = TDCN01.benVayKhachHang.phone;
			tw.local.MB02A.borrower.informationCustomer.documentType = TDCN01.benVayKhachHang.documentType;
			
			tw.local.MB02A.borrower.checkSpouse = TDCN01.isBorrower;
			tw.local.MB02A.borrower.informationCustomerSpouse.designation = TDCN01.benVayVoChongKhachHang.Title;
			tw.local.MB02A.borrower.informationCustomerSpouse.fullName = TDCN01.benVayVoChongKhachHang.name;
			tw.local.MB02A.borrower.informationCustomerSpouse.phone = TDCN01.benVayVoChongKhachHang.phone;
			tw.local.MB02A.borrower.informationCustomerSpouse.documentType = TDCN01.benVayVoChongKhachHang.documentType;
			tw.local.MB02A.borrower.informationCustomerSpouse.identificationNumber = TDCN01.benVayVoChongKhachHang.identificationNumber;
			tw.local.MB02A.borrower.informationCustomerSpouse.issuePlace = TDCN01.benVayVoChongKhachHang.placeOfIssue;
			tw.local.MB02A.borrower.informationCustomerSpouse.issueDate = TDCN01.benVayVoChongKhachHang.dateOfIssue;
			tw.local.MB02A.borrower.informationCustomerSpouse.permanentResidenceAddress = TDCN01.benVayVoChongKhachHang.permanentAddress;
			
			
			var listAddressVC = tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.addressList;
			for(var i = 0; i < listAddressVC.length; i++){
				if(listAddress[i].addressType === '03'){
					tw.local.MB02A.borrower.informationCustomerSpouse.currentResidenceAddress = listAddressVC[i].fullAddress;
				}
			}
			
					var listIdentificationVoChong1 = [];
	
			// Duyệt qua danh sách copayerList để lấy idType (list 3)
	
			for (var i = 0; i < tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.identificationDocuments.length; i++) {
				var idTypeValue = tw.local.loanApplicationInformation.legalInformation.personalInformation.customerSpouseInformation.identificationDocuments[i].idType;
			
				// Tìm trong listIdentification (list 2) xem có name nào tương ứng với value không
				for (var j = 0; j < tw.local.listIdentificationVoChong.length; j++) {
					if (tw.local.listIdentificationVoChong[j].value === idTypeValue) {
						// Nếu tìm thấy, thêm vào listIdentification1
						listIdentificationVoChong1.push({
							name: tw.local.listIdentificationVoChong[j].name,
							value: idTypeValue
						});
						break; // Thoát vòng lặp khi tìm thấy
					}
				}
			}
			
			tw.local.listIdentificationVoChong = listIdentificationVoChong1;
	
				
		}
		
		var planLoan = tw.local.loanApplicationInformation.loanPurpose.ClauseLoan.planLoan;
		console.log("console.log(planLoan);");
		console.log(planLoan);
		for(var i = 0; i < planLoan.length; i++){
			tw.local.MB02A.generalTerms.tableAsset[i] = {};
			tw.local.MB02A.generalTerms.tableAsset[i].id = "dieu1Table"+i;
			tw.local.MB02A.generalTerms.tableAsset[i].address = planLoan[i].fullAddress;
		}
		
		tw.local.MB02A.generalTerms.maxLoanAmountForTransfer = TDCN01.choVayGiaiNgan.loanAmountNumeric;
		tw.local.MB02A.generalTerms.maxLoanAmountForTransferInWord = TDCN01.choVayGiaiNgan.loanAmountText;
		tw.local.MB02A.generalTerms.time = TDCN01.choVayGiaiNgan.loanMaturityPeriod;
		
		tw.local.MB02A.disbursement.beneficiaryAccountBlockingPeriod = "90 ngày";
		tw.local.MB02A.interestPaymentSecurity.withinTerm = "90 ngày";
		
	} catch (e) {
		console.error(`Error mapping data to MB02A `, e);
	}
	
	function dateToString(date) {
		return date != null ? date.format("dd/MM/yyyy", "GMT+07:00") : "";
	}
	
	function getString(str) {
		if (typeof str === 'number') {
			return str.toString();
		}
		
		return !!str ? str : "";
	}