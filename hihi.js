var view = this;
var tinyMceDocument = window.document;
var context = this.context;
var processedElements = new Set();
var commentData = context.options.commentData.get("value");
var commentsArray = commentData ? JSON.parse(commentData) : [];
var commentIdCounter = 1;

// =============== START tiny editor ========================

function onloadEditor() {
	var css = "";
	try {
		css = "` <style>" + document.getElementById("css_khong_chi_muc").innerHTML
			+ document.getElementById("css_chi_muc").innerHTML
			+ document.getElementById("css_comment").innerHTML
			+ " </style>`";
	} catch (e) {
		console.log("onloadEditor could not get css");
	}

	tinymce.init({
		selector: '#editor',
		plugins: 'table',
		toolbar: 'undo redo | blocks | ' +
			'bold italic underline styleselect | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'getSelectedText' + ' | addHeadingButton | ' +
			' lineheightselect',
		height: 600,
		readonly: true,
		object_resizing: false,
		content_style: css,

		setup: function (editor) {
			editor.addButton('lineheightselect', {
				text: 'Line Height',
				type: 'menubutton',
				menu: [
					{ text: '1', onclick: function () { setLineHeightStyle('1'); } },
					{ text: '1.5', onclick: function () { setLineHeightStyle('1.5'); } },
					{ text: '2', onclick: function () { setLineHeightStyle('2'); } },
					{ text: '2.5', onclick: function () { setLineHeightStyle('2.5'); } },
					{ text: '3', onclick: function () { setLineHeightStyle('3'); } }
				]
			});

			editor.addButton('addHeadingButton', {
				text: 'Chỉ mục',
				type: 'menubutton',
				menu: [
					{ text: 'Thêm Điều', onclick: function () { addHeading('section'); } },
					{ text: 'Thêm mục cùng cấp', onclick: function () { addSameLevel(); } },
					{ text: 'Thêm cấp con', onclick: function () { addSubLevel(); } },
					{ text: 'Tăng cấp chỉ mục', onclick: function () { increaseLevel(); } },
					{ text: 'Thêm dòng mới', onclick: function () { addNewLine(); } },
					{ text: 'Thêm gạch đầu dòng', onclick: function () { addBulletPoint(); } },
					{ text: 'Thêm chấm đầu dòng', onclick: function () { addBulletPointLV2(); } }
				]
			});

			function setLineHeightStyle(value) {
				tinymce.get('editor').contentDocument.body.style.lineHeight = value;
				tinymce.activeEditor.dom.get('allvoice').style.lineHeight = value;
			}

			//=============== START khai báo chỉ mục ========================
			editor.on('keydown', function (event) {
				if (event.keyCode === 13) { // Keycode for Enter
					event.preventDefault(); // Ngăn chặn hành động mặc định của Enter

					const selection = editor.selection.getRng(); // Lấy phạm vi (range) được chọn
					const activeElement = editor.selection.getNode(); // Lấy phần tử hiện tại được chọn

					// Tạo một span với <br /> và ký tự khoảng trắng
					const span = editor.dom.create('span', {}, '<br />&nbsp;');

					// Chèn span vào vị trí con trỏ
					editor.selection.setRng(selection);
					editor.selection.getRng().insertNode(span);

					// Di chuyển con trỏ đến sau phần tử span
					editor.selection.setCursorLocation(span, 1);
				}
			});
			// =============== START chỉ mục ========================
			function addHeading(type) {
				const editor = tinymce.activeEditor; // Truy cập vào editor đang hoạt động

				// Tạo phần tử 'div' mới với lớp 'heading' và 'contenteditable' trong TinyMCE
				const newHeading = editor.dom.create('div', {
					class: `${type} heading`,
					contenteditable: 'true',
					tabindex: '0'
				});

				// Tạo thẻ 'div' hoặc 'span' để bọc nội dung bên trong (giống với contentIndex)
				const wrapper = editor.dom.create('div', {
					class: 'contentIndex'
				}, 'Thêm nội dung mới'); // Nội dung mặc định

				// Chèn 'wrapper' vào trong 'newHeading'
				newHeading.appendChild(wrapper);

				// Lấy phần tử 'allvoice' bên trong nội dung của TinyMCE
				const allVoiceElement = editor.dom.get('allvoice'); // Lấy phần tử có id 'allvoice'

				if (allVoiceElement) {
					// Chèn 'newHeading' vào trong 'allvoice'
					allVoiceElement.appendChild(newHeading);

					// Đặt con trỏ vào phần tử mới thêm để có thể chỉnh sửa ngay
					editor.selection.select(newHeading);
					editor.selection.collapse(false);

					// Cập nhật nội dung TinyMCE sau khi thêm phần tử
//					editor.setContent(editor.getContent());
				} else {
					console.log('Không tìm thấy phần tử có id là "allvoice"');
				}
			}

			function addSameLevel() {
				const editor = tinymce.activeEditor; // Lấy trình soạn thảo hiện tại của TinyMCE
				const selection = editor.selection; // Lấy đối tượng selection từ TinyMCE
				const range = selection.getRng(); // Lấy range hiện tại

				let node = range.startContainer;

				while (node && node !== editor.getBody()) { // Sử dụng getBody() để lấy phần tử gốc của trình soạn thảo
					if (node.nodeType === Node.ELEMENT_NODE && editor.dom.hasClass(node, 'heading')) {
						const newHeading = editor.dom.create('div', {
							class: node.className,
							contenteditable: 'true',
							tabindex: '0'
						});

						// Bọc nội dung trong thẻ <div>
						const wrapper = editor.dom.create('div', {
							class: 'contentIndex'
						}, 'Thêm nội dung mới');

						newHeading.appendChild(wrapper);
						editor.dom.insertAfter(newHeading, node);

						// Cập nhật vị trí của con trỏ sau khi thêm phần tử mới
						const newLineRange = editor.dom.createRng();
						newLineRange.setStart(newHeading, 0);
						newLineRange.collapse(true);
						selection.setRng(newLineRange); // Thiết lập lại range trong TinyMCE

						editor.focus(); // Đảm bảo con trỏ vẫn nằm trong trình soạn thảo

						break;
					}
					node = node.parentNode;
				}
			}

			function addSubLevel() {
				const editor = tinymce.activeEditor; // Lấy trình soạn thảo hiện tại của TinyMCE
				const selection = editor.selection; // Lấy đối tượng selection từ TinyMCE
				const range = selection.getRng(); // Lấy range hiện tại

				let node = range.startContainer;

				while (node && node !== editor.getBody()) { // Sử dụng getBody() để lấy phần tử gốc của trình soạn thảo
					if (node.nodeType === Node.ELEMENT_NODE && editor.dom.hasClass(node, 'heading')) {
						const levels = ['section', 'number', 'subnumber', 'subletter', 'roman'];
						let currentLevel = levels.findIndex(level => editor.dom.hasClass(node, level));

						if (currentLevel < levels.length - 1) {
							currentLevel++;
						}

						const newHeading = editor.dom.create('div', {
							class: `${levels[currentLevel]} heading`,
							contenteditable: 'true',
							tabindex: '0'
						});

						// Bọc nội dung trong thẻ <div> hoặc <span>
						const wrapper = editor.dom.create('div', {
							class: 'contentIndex'
						}, 'Thêm nội dung mới');

						newHeading.appendChild(wrapper);
						editor.dom.insertAfter(newHeading, node);

						// Cập nhật vị trí của con trỏ sau khi thêm phần tử mới
						const newLineRange = editor.dom.createRng();
						newLineRange.setStart(newHeading, 0);
						newLineRange.collapse(true);
						selection.setRng(newLineRange); // Thiết lập lại range trong TinyMCE

						editor.focus(); // Đảm bảo con trỏ vẫn nằm trong trình soạn thảo

						break;
					}
					node = node.parentNode;
				}
			}

			function increaseLevel() {
				const editor = tinymce.activeEditor; // Lấy trình soạn thảo hiện tại của TinyMCE

				const selection = editor.selection; // Lấy đối tượng selection từ TinyMCE
				const range = selection.getRng(); // Lấy range hiện tại

				let node = range.startContainer;

				while (node && node !== editor.getBody()) { // Sử dụng getBody() để lấy phần tử gốc của trình soạn thảo
					if (node.nodeType === Node.ELEMENT_NODE && (editor.dom.hasClass(node, 'heading') || editor.dom.hasClass(node, 'bullet'))) {

						adjustHeadingLevel(node, -1); // Gọi hàm điều chỉnh cấp độ cho heading

						break;
					}
					node = node.parentNode;
				}
			}

			function adjustHeadingLevel(element, direction) {
				const levels = ['section', 'number', 'subnumber', 'subletter', 'roman'];
				let currentLevel = levels.findIndex(level => tinymce.activeEditor.dom.hasClass(element, level));

				if (currentLevel === -1) return;

				const newLevel = Math.max(0, Math.min(levels.length - 1, currentLevel + direction));

				if (newLevel !== currentLevel) {
					tinymce.activeEditor.dom.removeClass(element, levels[currentLevel]);
					tinymce.activeEditor.dom.addClass(element, levels[newLevel]);

					const editor = tinymce.activeEditor; // Đảm bảo chỉnh sửa trong nội dung của TinyMCE
					editor.selection.select(element); // Đặt con trỏ tại vị trí phần tử đã chỉnh sửa
					editor.nodeChanged(); // Cập nhật thay đổi trong TinyMCE
				}
			}

			function addNewLine() {
				const editor = tinymce.activeEditor; // Lấy trình soạn thảo hiện tại của TinyMCE
				const selection = editor.selection; // Lấy đối tượng selection từ TinyMCE
				const range = selection.getRng(); // Lấy range hiện tại

				// Tạo phần tử mới sử dụng TinyMCE DOM API
				const newLine = editor.dom.create('p', {
					class: 'new-line',
					contenteditable: 'true',
					tabindex: '0'
				}, 'Dòng mới'); // Nội dung mặc định, có thể thay đổi

				const parentNode = range.startContainer;
				let referenceNode = parentNode;

				// Duyệt ngược lên cho đến khi tìm thấy phần tử cha của đoạn văn trong editor
				while (referenceNode && referenceNode.parentNode !== editor.dom.get('allvoice')) {
					referenceNode = referenceNode.parentNode;
				}

				if (referenceNode && referenceNode.parentNode === editor.dom.get('allvoice')) {
					// Chèn phần tử mới sau phần tử hiện tại
					editor.dom.insertAfter(newLine, referenceNode);

					// Cập nhật vị trí con trỏ sau khi thêm dòng mới
					const newLineRange = editor.dom.createRng();
					newLineRange.setStart(newLine, 0);
					newLineRange.collapse(true);
					selection.setRng(newLineRange); // Thiết lập lại range trong TinyMCE

					editor.focus(); // Đảm bảo con trỏ vẫn nằm trong trình soạn thảo
				}
			}

			function addBulletPoint() {
				const editor = tinymce.activeEditor; // Lấy trình soạn thảo hiện tại của TinyMCE
				const selection = editor.selection; // Lấy đối tượng selection từ TinyMCE
				const range = selection.getRng(); // Lấy range hiện tại

				// Tạo phần tử div sử dụng TinyMCE DOM API
				const newBullet = editor.dom.create('div', {
					class: 'bullet bullet-level-1',
					contenteditable: 'true',
					tabindex: '0'
				});

				// Tạo phần tử span với nội dung
				const newParagraph = editor.dom.create('div', {}, 'Dòng mới'); // Nội dung mặc định, có thể thay đổi

				// Thêm thẻ span vào thẻ div
				newBullet.appendChild(newParagraph);

				let referenceNode = range.startContainer;

				// Duyệt ngược lên cho đến khi tìm thấy phần tử cha của đoạn văn trong editor
				while (referenceNode && referenceNode.parentNode !== editor.dom.get('allvoice')) {
					referenceNode = referenceNode.parentNode;
				}

				if (referenceNode && referenceNode.parentNode === editor.dom.get('allvoice')) {
					// Thêm phần tử mới sau node hiện tại trong editor
					editor.dom.insertAfter(newBullet, referenceNode);

					// Cập nhật vị trí con trỏ sau khi thêm dòng mới
					const newLineRange = editor.dom.createRng();
					newLineRange.setStart(newBullet, 0);
					newLineRange.collapse(true);
					selection.setRng(newLineRange); // Thiết lập lại range trong TinyMCE

					editor.focus(); // Đảm bảo con trỏ vẫn nằm trong trình soạn thảo
				}
			}

			function addBulletPointLV2() {
				const editor = tinymce.activeEditor; // Lấy trình soạn thảo hiện tại của TinyMCE
				const selection = editor.selection; // Lấy đối tượng selection từ TinyMCE
				const range = selection.getRng(); // Lấy range hiện tại

				// Tạo phần tử div sử dụng TinyMCE DOM API
				const newBullet = editor.dom.create('div', {
					class: 'bullet bullet-level-2',
					contenteditable: 'true',
					tabindex: '0'
				});

				// Tạo phần tử span với nội dung
				const newParagraph = editor.dom.create('div', {}, 'Dòng mới'); // Nội dung mặc định, có thể thay đổi

				// Thêm thẻ span vào thẻ div
				newBullet.appendChild(newParagraph);

				let referenceNode = range.startContainer;

				// Duyệt ngược lên cho đến khi tìm thấy phần tử cha của đoạn văn trong editor
				while (referenceNode && referenceNode.parentNode !== editor.dom.get('allvoice')) {
					referenceNode = referenceNode.parentNode;
				}

				if (referenceNode && referenceNode.parentNode === editor.dom.get('allvoice')) {
					// Chèn phần tử mới sau node hiện tại trong editor
					editor.dom.insertAfter(newBullet, referenceNode);

					// Cập nhật vị trí con trỏ sau khi thêm dòng mới
					const newLineRange = editor.dom.createRng();
					newLineRange.setStart(newBullet, 0);
					newLineRange.collapse(true);
					selection.setRng(newLineRange); // Thiết lập lại range trong TinyMCE

					editor.focus(); // Đảm bảo con trỏ vẫn nằm trong trình soạn thảo
				}
			}
			// =============== END chỉ mục ===========================
			//=============== END khai báo chỉ mục ========================		
			editor.on('init', function () {
				var contentHTML = context.options.contentHTML.get("value");
				// var contentHTML = document.getElementById("allvoice").outerHTML;
				editor.setContent(contentHTML);
				editor.on('keydown', function (e) {
					if (e.key.charCodeAt(0) >= 32 && e.key.charCodeAt(0) <= 255) {
						// Color when typing
						this.execCommand("backcolor", false, "#a7ff83");
					}
				});
			});

			//      ================ Start Comment =================
			view.getSelectedText = getSelectedText;
			function getSelectedText() {
				try {
					if (editor.selection.getRng().collapsed) {
						alert("Vui lòng bôi đen một phần muốn comment");
						return;
					}
					console.log(editor.selection.getRng());
					addComment(null, null, null, editor.selection.getRng());
				} catch (e) {
					console.error("Có lỗi khi thêm comment");
				}
			}

			// //thêm classes cho spans
			// function applyClasses(classes, spans) {
			// 	spans.forEach(span => {
			// 		classes.forEach(cls => {
			// 			span.classList.add(cls);
			// 		});
			// 	});
			// }

			// Thêm một nút tùy chỉnh vào thanh công cụ để lấy nội dung văn bản được chọn
			editor.addButton('getSelectedText', {
				text: 'Comment',
				icon: false,
				onclick: function () {
					getSelectedText();
				}
			});

			//Danh sách trường
			// var commentsArray = JSON.parse(context.binding.get("value").get("commentData"));
			//			console.log(commentsArray);
			// var commentIdCounter = 1;
			try {
				var maxId = commentsArray[commentsArray.length - 1].id;
				commentIdCounter = Number(maxId.substring(maxId.lastIndexOf("-") + 1));
			} catch (err) {
				commentIdCounter;
			}

			//add funcion draggable
			document.addEventListener('mouseup', function () {
				isDown = false;
			}, true);

			document.addEventListener('mousemove', function (event) {
				var div = document.querySelector('.comment-box');
				event.preventDefault();
				if (isDown) {
					isDragging = true;
					mousePosition = {
						x: event.clientX,
						y: event.clientY
					};
					div.style.left = (mousePosition.x + offset[0]) + 'px';
					div.style.top = (mousePosition.y + offset[1]) + 'px';
				}
			}, true);

			//hàm tạo mới comment
			function addComment(id, content, name, range) {
				var commentsContainer = document.getElementById("comment-list");
				var existingCommentBox = document.querySelector('.comment-box');
				if (existingCommentBox) {
					commentsContainer.removeChild(existingCommentBox);
				}
				if (!id) {
					commentIdCounter++;  // Tăng giá trị biến đếm mỗi khi tạo comment box
					id = `comment-box-${commentIdCounter}`;  // Tạo ID duy nhất
					content = '';
					name = context.bpm.system.user_fullName;
				}
				const commentItem = document.createElement('div');
				commentItem.className = 'comment-box';
				commentItem.id = id;
				commentItem.setAttribute('tabindex', '0');
				commentItem.innerHTML = `
					<div class="comment-header">
						<div class="comment-author">
							<span id="comment-name-${id}">${name}</span>
						</div>
					</div>
					<div class="comment-content">
						<textarea id="comment-text-${id}" rows="5" class="comment-textarea" placeholder = "Viết bình luận vào đây">${content}</textarea>
					</div>
					<div class="comment-footer">
						<div class="">
							<button class="comment-cancel-docs">Ẩn</button>
							<button class="comment-submit comment-submit-disabled" id="submit-${id}">Lưu</button>
						</div>
					</div>
				`;
				commentsContainer.appendChild(commentItem);
				commentItem.addEventListener('mousedown', function (e) {
					isDragging = false;
					isDown = true;
					offset = [
						commentItem.offsetLeft - e.clientX,
						commentItem.offsetTop - e.clientY
					];
				}, true);
				const commentNameInput = document.querySelector(`#comment-name-${id}`);
				const commentTextarea = document.querySelector(`#comment-text-${id}`);
				const commentSubmitButton = document.querySelector(`#submit-${id}`);
				const cancelButton = commentItem.querySelector('.comment-cancel-docs');

				//	commentItem.focus();

				cancelButton.addEventListener('click', () => {
					if (commentsContainer && commentsContainer.contains(commentItem)) {
						commentsContainer.removeChild(commentItem);
					}
				});



				commentTextarea.focus();

				commentTextarea.addEventListener('input', () => {
					if (commentTextarea.value.trim()) {
						commentSubmitButton.classList.remove('comment-submit-disabled');
						commentSubmitButton.classList.add('comment-submit-enable');
					} else {
						commentSubmitButton.classList.remove('comment-submit-enable');
						commentSubmitButton.classList.add('comment-submit-disabled');
					}
				});

				commentSubmitButton.addEventListener('click', () => {
					if (commentTextarea.value.trim()) {
						commentsArray.push({
							id: id,
							comment: commentTextarea.value.trim(),
							name: commentNameInput.textContent.trim(),
							pID: null,
						});
						//range start
						var rangeStart = new Range();
						console.log(range);
						rangeStart.setStart(range.startContainer, range.startOffset);
						rangeStart.setEnd(range.startContainer, range.startContainer.textContent.length);
						// end
						var rangeEnd = new Range();
						rangeEnd.setStart(range.endContainer, 0);
						rangeEnd.setEnd(range.endContainer, range.endOffset);

						var spansInRange = [];
						if (range.startContainer == range.endContainer) {
							var span = SpanCreate(range);
							spansInRange.push(span);
						}
						else {
							var startSpan = SpanCreate(rangeStart);
							var endSpan = SpanCreate(rangeEnd);
							var spansInRange = getSpansInRange(tinyMceDocument.getElementById('allvoice'), range.startContainer, range.endContainer);
							spansInRange.push(endSpan);
							spansInRange.push(startSpan);
						}
						// spansInRange.push(endSpan);
						console.log(spansInRange);
						applyClasses([id, 'highlight', 'focus'], spansInRange);
						findAndAddEventListeners();

						showCommentBox(id, commentTextarea.value, name);
						console.log("chạy xong hàm");
					}
				});

				//Ấn ra ngoài thì hide comment
				document.addEventListener('click', function (event) {
					if (!commentItem.contains(event.target) && !isDragging) {
						// Clicked outside the comment box, trigger the cancel button
						cancelButton.click();
					}
				}, true);
			}


			//      ============== End of comment =================================================================


		}
	}).then(function () {
		tinyMceDocument = document.getElementById('editor_ifr').contentDocument;
		// onloadHTML sẽ được define riêng ở từng view chi tiết sau
		view.ui.getParent().onloadHTML();
		findAndAddEventListeners();
		loadHtmlOld();
	});
}

console.log(view.ui);

// =============== END tiny editor ===========================
// ========================	Start COMMENT	==========================
// var commentsArray = JSON.parse(context.binding.get("value").get("commentData"));
// var commentIdCounter = 1; // cách sửa tạm thời
try {
	var maxId = commentsArray[commentsArray.length - 1].id;
	commentIdCounter = Number(maxId.substring(maxId.lastIndexOf("-") + 1));
} catch (err) {
	commentIdCounter;
}
const eventHandlers = {};
var context = this.context;
var div;
var isDown = false;
var isDragging = false;

var doc;
var editor;
var existingCommentBox;

function saveCommentData() {
	var commentString = JSON.stringify(commentsArray);
	console.log(commentString);
	context.options.commentData.set("value", commentString);
}

//hàm show comment có sẵn
function showCommentBox(id = null, content = '', name = '') {
	const commentsContainer = document.getElementById("comment-list");
	console.log("chạy hàm showCommentBox");
	const existingCommentBox = document.querySelector('.comment-box');
	if (existingCommentBox) {
		commentsContainer.removeChild(existingCommentBox);
	}
	if (!id) {
		commentIdCounter++;  // Tăng giá trị biến đếm mỗi khi tạo comment box
		id = `comment-box-${commentIdCounter}`;  // Tạo ID duy nhất
		content = '';
	}
	const commentItem = document.createElement('div');
	commentItem.className = 'comment-box';
	commentItem.id = id;
	commentItem.setAttribute('tabindex', '0');
	commentItem.innerHTML = `
		<div class="comment-header">
			<div class="comment-author">
				<span contenteditable="false" id="comment-name-${id}">${name}</span>
			</div>
		</div>
		<div class="comment-content">
			<textarea id="comment-text-${id}" rows="5" class="comment-textarea">${content}</textarea>
		</div>
		<div class="comment-footer">
			<button class="comment-delete-docs" id="delete-${id}">Xoá</button>
			<button class="comment-cancel-docs">Ẩn</button>
		</div>
		<div id = "reply-list-${id}"></div>
		<div class="reply-content">
			<textarea id="reply-text-${id}" rows="2" class="comment-textarea" placeholder="Write a reply..."></textarea>
		</div>
		<div class="reply-footer" id="reply-footer-${id}">
			<button class="comment-cancel-docs" id="reply-cancel-${id}">Huỷ</button>
			<button class="comment-submit comment-submit-disabled" id="reply-submit-${id}">Lưu</button>
		</div>
	`;
	commentsContainer.appendChild(commentItem);
	commentItem.addEventListener('click', () => {
		if (!isDragging) {
			tinyMceDocument.getElementsByClassName(id)[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		}
	});
	commentItem.addEventListener('mousedown', function (e) {
		isDragging = false;
		isDown = true;
		offset = [
			commentItem.offsetLeft - e.clientX,
			commentItem.offsetTop - e.clientY
		];
	}, true);
	var cancelButton = commentItem.querySelector('.comment-cancel-docs');
	var deleteButton = document.querySelector(`#delete-${id}`);
	var replyTextarea = commentItem.querySelector(`#reply-text-${id}`);
	var replyFooter = commentItem.querySelector(`#reply-footer-${id}`);
	var replyCancelButton = commentItem.querySelector(`#reply-cancel-${id}`);
	var replySubmitButton = commentItem.querySelector(`#reply-submit-${id}`);
	var reply_list_id = `reply-list-${id}`;
	const reply_list = document.getElementById(reply_list_id);

	// Event click vào textarea của reply
	replyTextarea.addEventListener('focus', () => {
		replyFooter.style.visibility = 'visible';
	});

	replyTextarea.addEventListener('blur', () => {
		if (!replyTextarea.value.trim()) {
			replyFooter.style.visibility = 'hidden';
		}
	});

	replyTextarea.addEventListener('input', () => {
		if (replyTextarea.value.trim()) {
			replySubmitButton.classList.remove('comment-submit-disabled');
			replySubmitButton.classList.add('comment-submit-enable');
		} else {
			replySubmitButton.classList.remove('comment-submit-enable');
			replySubmitButton.classList.add('comment-submit-disabled');
		}
	});

	cancelButton.addEventListener('click', (event) => {
		event.stopPropagation();
		const commentsContainer = document.getElementById("comment-list");

		if (commentsContainer.contains(commentItem)) {
			commentsContainer.removeChild(commentItem);
			removeAllFocusClasses();
		}
	});

	replyCancelButton.addEventListener('click', () => {
		replyFooter.style.visibility = 'hidden';
		replyTextarea.value = '';
	});

	replySubmitButton.addEventListener('click', () => {
		commentIdCounter++;
		var reply_id = `comment-box-${commentIdCounter}`;
		createReply(reply_list, reply_id, replyTextarea.value, context.bpm.system.user_fullName);
		//thêm vào mảng
		commentsArray.push({
			id: reply_id,
			comment: replyTextarea.value,
			name: context.bpm.system.user_fullName,
			pID: id,
		});
		saveCommentData();
		//reset chỗ reply
		replyCancelButton.click();
	});

	deleteButton.addEventListener('click', (event) => {
		event.stopPropagation();
		const elements = tinyMceDocument.querySelectorAll(`.${id}`);
		elements.forEach(element => {
			var textNode = tinyMceDocument.createTextNode(element.textContent);
			element.parentNode.replaceChild(textNode, element);
		});
		commentsContainer.removeChild(commentItem);
		// Xóa comment khỏi mảng
		const commentIndex = commentsArray.findIndex(c => c.id === id);
		if (commentIndex !== -1) {
			commentsArray.splice(commentIndex, 1);
		}
		// Xóa tất cả các phần tử có pID bằng với id
		for (let i = commentsArray.length - 1; i >= 0; i--) {
			if (commentsArray[i].pID === id) {
				commentsArray.splice(i, 1);
			}
		}
		removeAllFocusClasses();
		saveCommentData();
	});

	//Thêm các cmt nếu có
	var addedReply = commentsArray.filter(comment => comment.pID === id);
	for (var i = 0; i < addedReply.length; i++) {
		createReply(reply_list, addedReply[i].id, addedReply[i].comment, addedReply[i].name);
	}

	//Ấn ra ngoài thì hide comment
	document.addEventListener('click', function (event) {
		if (!commentItem.contains(event.target) && !isDragging) {
			// Clicked outside the comment box, trigger the cancel button
			cancelButton.click();
		}
	}, true);
}

//tìm và thêm event handler
function findAndAddEventListeners() {
	for (let j = 0; j < commentsArray.length; j++) {
		let comment = commentsArray[j];
		let elements = tinyMceDocument.querySelectorAll(`.${comment.id}`);
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			if (!processedElements.has(element)) {
				processedElements.add(element);
				element.addEventListener('click', (event) => {
					console.log("chạy click");
					event.stopPropagation();
					if (!tinyMceDocument.getElementById(comment.id)) {
						removeAllFocusClasses();
						showCommentBox(comment.id, comment.comment, comment.name);
						let elementfocus = tinyMceDocument.querySelectorAll(`.${comment.id}`);
						applyClasses(['focus'], elementfocus);
					}
				});
			}
		}
	}
	saveCommentData();
}


function LoadComment() {
	// Lay HTML tu DB
	//$('#editor').trumbowyg('html', context.binding.get("value").get("htmlContent"));

	// Disable editor by default
	//$('#editor').trumbowyg('disable');

	doc = document.getElementById('allvoice');

	console.log(doc);

	var elements = document.querySelectorAll("#allvoice");

	console.log(elements);
	console.log(editor.getbody());

	// var comment_box = document.createElement('div');
	// comment_box.classList.add('nav-action-comment-box');
	// comment_box.classList.add('col');
	// comment_box.id = 'comment-list';
	// // comment_box.contentEditable = "false";
	// doc.parentNode.insertBefore(comment_box, doc);

	findAndAddEventListeners();
}

function createReply(commentElement, id, content, name) {
	const replyContainer = document.createElement('div');
	replyContainer.classList.add('reply-container-${id}');
	replyContainer.innerHTML = `
		<div class="reply-header" id="reply-header-${id}">
			<div class="reply-author">
				<span>${name}</span>
			</div>
		</div>
		<div class="reply-content" id="reply-content-${id}">
			<textarea id="reply-text-${id}" rows="2" class="comment-textarea" placeholder="Viết trả lời vào đây">${content}</textarea>
		</div>
		<div class="reply-footer" style = "visibility: visible;">
			<button class="comment-cancel-docs" id="reply-cancel-${id}">Xoá</button>
		</div>
	`;

	commentElement.appendChild(replyContainer);
	const cancelButton = commentElement.querySelector(`#reply-cancel-${id}`);

	cancelButton.addEventListener('click', () => {
		//xoá khỏi mảng
		const commentReplyIndex = commentsArray.findIndex(c => c.id === id);
		if (commentReplyIndex !== -1) {
			commentsArray.splice(commentReplyIndex, 1);
		}
		console.log(commentsArray);
		saveCommentData();
		commentElement.removeChild(replyContainer);
	});
}

//thêm classes cho spans
function applyClasses(classes, spans) {
	spans.forEach(span => {
		classes.forEach(cls => {
			span.classList.add(cls);
		});
	});
}

//Tìm tất cả span có trong khoảng chọn
function getSpansInRange(rootNode, startNode, endNode) {
	let spanList = [];
	let isInRange = false;
	function traverse(node) {
		if (node === startNode) {
			isInRange = true;
		}
		if (isInRange && node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'span') {
			spanList.push(node);
		}
		for (let i = 0; i < node.childNodes.length; i++) {
			traverse(node.childNodes[i]);
		}
		if (node === endNode) {
			isInRange = false;
		}
	}
	traverse(rootNode);
	return spanList;
}

function SpanCreate(range) {
	var span = document.createElement('SPAN');
	span.innerHTML = range.toString();
	range.deleteContents();
	range.insertNode(span);
	return span;
}

function onclick_btn_cmt() {
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		addComment(null, null, null, range);
	}
}

this.saveHTML = function () {
	// Bỏ phần comment khỏi HTML
	try {
		removeAllFocusClasses();
		if (tinyMceDocument.getElementById("comment-list")) {
			tinyMceDocument.getElementById("comment-list").innerHTML = '';
		}
	} catch (err) {
		console.error(err);
	}
	// Lưu HTML
	// var htmlContent = tinyMceDocument.getElementById("allvoice").outerHTML;
	// console.log(htmlContent);
	// this.context.binding.get("value");
}

this.loadHtmlOld = function () {
	try {
		var htmlContent = tinyMceDocument.getElementById("allvoice").outerHTML;
		context.options.contentHTML.set("value", htmlContent);
	} catch (e) {
		console.error("Có lỗi khi gọi loadHtmlOld");
	}
}

function removeAllFocusClasses() {
	try {
		const focusedElements = tinyMceDocument.getElementsByClassName('focus');
		console.log(focusedElements);
		for (let i = focusedElements.length - 1; i >= 0; i--) {
			focusedElements[i].classList.remove('focus');
		}
	} catch (e) {
		console.error(e);
	}
}


// ===================	End COMMENT	======================

// ================= START load HTML ===========================
var objectFocus = { "id": "", "color": "" };
// Lưu lại trạng thái html tag trước khi được focus
var htmlBeforeFocused = { "id": "", "backcolor": "" };
var colorRed = "rgba(245, 39, 39, 0.54)";
var colorYellow = "rgba(243, 245, 39, 0.5)"

/**
 * Set up giá trị HTML theo biến BPM
 * và add event khi click HTML
 */
this.setupHTML = setupHTML;
function setupHTML(htmlId, bpmId, defaultVal, bpmType) {
	try {

		// load giá trị từ BPM vào HTML
		updateContentHTML(htmlId, bpmId, defaultVal);
		// add event khi click HTML sẽ focus vào BPM tương ứng
		addEventOnclickHTML(htmlId, bpmId, bpmType);
		// add event khi click BPM sẽ focus vào HTML tương ứng
		addEventOnclickBPM(htmlId, bpmId, bpmType);
	} catch (e) {
		console.error("ERROR ---- setupHTML--" + "htmlId:" + htmlId + "---bpmmId:" + bpmId + "--- Detail ERROR ---" + e.toString());
	}
}

this.setupHTMLList = setupHTMLList;
function setupHTMLList(htmlId, bpm, defaultVal, bpmType) {
	try {

		// load giá trị từ BPM vào HTML
		updateContentHTMLnew(htmlId, bpm, defaultVal);
		// add event khi click HTML sẽ focus vào BPM tương ứng
		addEventOnclickHTMLnew(htmlId, bpm, bpmType);
		// add event khi click BPM sẽ focus vào HTML tương ứng
		addEventOnclickBPMnew(htmlId, bpm, bpmType);
	} catch (e) {
		console.error("ERROR ---- setupHTML--" + "htmlId:" + htmlId + "---bpmmId:" + bpmId + "--- Detail ERROR ---" + e.toString());
	}
}

/**
 * Update HTML = giá trị BPM input theo ID tương ứng
 * và đổi màu background
 */
function updateContentHTML(htmlId, bpmId, defaultVal) {
	try {
		// Lấy value BPM tùy theo kiểu dữ liệu
		var bpmValue = "";
		var bpmInput = view.ui.getParent().ui.get(bpmId);
		if (!bpmInput) {
			return;
		}
		var bpmInputType = bpmInput.getType() || "";
		if (bpmInputType == "text.3") {
			bpmValue = bpmInput.getData() || "";
		} else if (bpmInputType == "integer.3" || bpmInputType == "decimal.3") {
			bpmValue = convertNumbertoString(bpmInput.getData()) || "";
		} else if (bpmInputType == "dateTimePicker.3") {
			bpmValue = fomatDate(bpmInput.getDate());
		} else if (bpmInputType == "singleSelect.3") {
			bpmValue = bpmInput.getItemText(bpmInput.getSelectedItem());
		}

		// Update HTML
		var htmlEle = tinyMceDocument.getElementById(htmlId);
		if (!htmlEle) {
			console.warn("updateContentHTML tag id " + htmlId + " does not exist in HTML file");
			return;
		}
		if (bpmValue != "") {
			//htmlEle.textContent = bpmValue;
			htmlEle.style.backgroundColor = colorRed;
			// neu co gia tri thi khong cho sua ben HTML
			htmlEle.contentEditable = "false";
		} else {
			//			htmlEle.textContent = defaultVal;
			htmlEle.style.backgroundColor = '#ffffff';
			htmlEle.contentEditable = "false";
		}
	} catch (e) {
		console.error("ERROR ---- updateContentHTML with" + "htmlId =" + htmlId + "--- Detail ERROR ---" + e.toString());
	}
}

function updateContentHTMLnew(htmlId, bpm, defaultVal) {
	try {
		// Lấy value BPM tùy theo kiểu dữ liệu
		var bpmValue = "";
		var bpmInput = bpm;
		if (!bpmInput) {
			return;
		}
		var bpmInputType = bpmInput.getType() || "";
		if (bpmInputType == "text.3") {
			bpmValue = bpmInput.getData() || "";
		} else if (bpmInputType == "integer.3" || bpmInputType == "decimal.3") {
			bpmValue = convertNumbertoString(bpmInput.getData()) || "";
		} else if (bpmInputType == "dateTimePicker.3") {
			bpmValue = fomatDate(bpmInput.getDate());
		} else if (bpmInputType == "singleSelect.3") {
			bpmValue = bpmInput.getItemText(bpmInput.getSelectedItem());
		}

		// Update HTML
		var htmlEle = tinyMceDocument.getElementById(htmlId);
		if (!htmlEle) {
			console.warn("updateContentHTML tag id " + htmlId + " does not exist in HTML file");
			return;
		}
		if (bpmValue != "") {
			//htmlEle.textContent = bpmValue;
			htmlEle.style.backgroundColor = colorRed;
			// neu co gia tri thi khong cho sua ben HTML
			htmlEle.contentEditable = "false";
		} else {
			//			htmlEle.textContent = defaultVal;
			htmlEle.style.backgroundColor = '#ffffff';
			htmlEle.contentEditable = "false";
		}
	} catch (e) {
		console.error("ERROR ---- updateContentHTML with" + "htmlId =" + htmlId + "--- Detail ERROR ---" + e.toString());
	}
}

/**
 * Add event khi click HTML focus vào BPM tương ứng
 */
function addEventOnclickHTML(htmlId, bpmId, bpmType) {
	try {
		var htmlEle = tinyMceDocument.getElementById(htmlId);
		if (htmlEle) {
			// jQuery('body').on('click', `#${htmlId}`, function () {
			htmlEle.addEventListener('click', function () {
				event.stopPropagation();
				// if (tinyMceDocument.getElementById(htmlBeforeFocused.id)) {
				// 	tinyMceDocument.getElementById(htmlBeforeFocused.id).style.backgroundColor = htmlBeforeFocused.backcolor;
				// }
				htmlEle.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
				var bpmUI = view.ui.getParent().ui.get(bpmId);
				console.log(bpmUI)
				bpmUI.focus();
			});
		}
	} catch (e) {
		console.error("ERROR -- addEventOnclickHTML---" + htmlId + "--- " + e.toString());
	}
}

function addEventOnclickHTMLnew(htmlId, bpm, bpmType) {
	try {
		var htmlEle = tinyMceDocument.getElementById(htmlId);
		if (htmlEle) {
			// jQuery('body').on('click', `#${htmlId}`, function () {
			htmlEle.addEventListener('click', function () {
				event.stopPropagation();
				// if (tinyMceDocument.getElementById(htmlBeforeFocused.id)) {
				// 	tinyMceDocument.getElementById(htmlBeforeFocused.id).style.backgroundColor = htmlBeforeFocused.backcolor;
				// }
				htmlEle.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
				var bpmUI = bpm;
				console.log(bpmUI)
				bpmUI.focus();
			});
		}
	} catch (e) {
		console.error("ERROR -- addEventOnclickHTML---" + htmlId + "--- " + e.toString());
	}
}

/**
 * Add event khi click BPM focus vào HTML tương ứng
 */
function addEventOnclickBPM(htmlId, bpmId, bpmType) {
	try {
		if (!context.options.viewName) {
			console.error("CommonView -- viewName is not configured properly");
			return;
		}
		var bpmInput = view.ui.getParent().ui.get(bpmId);
		if (!bpmInput) {
			console.error("addEventOnclickBPM - Could not found BPM UI " + bpmId);
			return;
		}
		var bpmInputType = bpmInput.getType() || "";
		var DOM_bpmId = bpmType + "-" + context.options.viewName.get("value") + ":" + bpmId;
		var DOM_bpmUI = document.getElementById(DOM_bpmId);
		if (!DOM_bpmUI) {
			console.warn("addEventOnclickBPM - Could not found element id = " + DOM_bpmId);
			return;
		}
		if (bpmInputType != "dateTimePicker.3") {
			DOM_bpmUI.addEventListener("focus", function () {
				var htmlEle = tinyMceDocument.getElementById(htmlId);
				htmlBeforeFocused.id = htmlId;
				htmlBeforeFocused.backcolor = htmlEle.style.backgroundColor;
				htmlEle.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
				htmlEle.style.backgroundColor = colorYellow;
			});
			DOM_bpmUI.addEventListener("blur", function () {
				if (tinyMceDocument.getElementById(htmlBeforeFocused.id)) {
					tinyMceDocument.getElementById(htmlBeforeFocused.id).style.backgroundColor = htmlBeforeFocused.backcolor;
				}
			});
		}
	} catch (e) {
		console.error("ERROR -- addEventFocusOnBpmUI---" + htmlId + "--- " + e.toString());
	}
}

function addEventOnclickBPMnew(htmlId, bpm, bpmType) {
	try {
		// if (!context.options.viewName) {
		// 	console.error("CommonView -- viewName is not configured properly");
		// 	return;
		// }
		// var bpmInput = bpm;
		// if (!bpmInput) {
		// 	console.error("addEventOnclickBPM - Could not found BPM UI ");
		// 	return;
		// }
		// var bpmInputType = bpmInput.getType() || "";
		// var DOM_bpmId = bpmType + "-" + context.options.viewName.get("value") + ":" + bpmId;
		// var DOM_bpmUI = document.getElementById(DOM_bpmId);
		// if (!DOM_bpmUI) {
		// 	console.warn("addEventOnclickBPM - Could not found element id = " + DOM_bpmId);
		// 	return;
		// }
		// if (bpmInputType != "dateTimePicker.3") {
			// bpm.addEventListener("focus", function () {
			// 	var htmlEle = tinyMceDocument.getElementById(htmlId);
			// 	htmlBeforeFocused.id = htmlId;
			// 	htmlBeforeFocused.backcolor = htmlEle.style.backgroundColor;
			// 	htmlEle.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
			// 	htmlEle.style.backgroundColor = colorYellow;
			// });
			// bpm.addEventListener("blur", function () {
			// 	if (tinyMceDocument.getElementById(htmlBeforeFocused.id)) {
			// 		tinyMceDocument.getElementById(htmlBeforeFocused.id).style.backgroundColor = htmlBeforeFocused.backcolor;
			// 	}
			// });
		// }
	} catch (e) {
		console.error("ERROR -- addEventFocusOnBpmUI---" + htmlId + "--- " + e.toString());
	}
}

/**
 * Focus vào HTML tương ứng khi click vào BPM input
 */
this.focusOnHTML = function (htmlId) {
	var htmlEle = tinyMceDocument.getElementById(htmlId);
	htmlBeforeFocused.id = htmlId;
	htmlBeforeFocused.backcolor = htmlEle.style.backgroundColor;
	htmlEle.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
	htmlEle.style.backgroundColor = colorYellow;
}
/**
 * Blur khỏi HTML
 */
this.blurHTML = function (htmlId) {
	var htmlEle = tinyMceDocument.getElementById(htmlId);
	htmlEle.style.backgroundColor = htmlBeforeFocused.backcolor;
}

this.warningChangeData = function (id, key) {
	var respApi = view.context.options.benBResp.get("value").get(key);
	var data = view.ui.get(id).getData();

	view.ui.get(id).setValid(true);
	view.ui.get(id).addClass("", "warningChange");

	if (!!respApi && !!respApi.get("value")) {
		if (id == "benBauthorizationDocumentDate") {
			if (!data || (!!data && data.toLocaleDateString('it-iT') != respApi.get("value").toLocaleDateString('it-iT'))) {
				view.ui.get(id).setValid(false, "Dữ liệu nhập thay đổi so với dữ liệu tích hợp!");
				view.ui.get(id).addClass("warningChange", "");
			}
		} else {
			if (data != respApi.get("value")) {
				view.ui.get(id).setValid(false, "Dữ liệu nhập thay đổi so với dữ liệu tích hợp!");
				view.ui.get(id).addClass("warningChange", "");
			}
		}
	}
}

function fomatDate(dateConvet) {
	var dateStr = "";
	try {
		var y = dateConvet.getFullYear();
		var m = dateConvet.getMonth() + 1;
		var d = dateConvet.getDate();
		var h = dateConvet.getHours();
		var mi = dateConvet.getMinutes();
		var sec = dateConvet.getSeconds();
		if (m < 10) m = "0" + m;
		if (d < 10) d = "0" + d;
		if (h < 10) h = "0" + h;
		if (mi < 10) mi = "0" + mi;
		if (sec < 10) sec = "0" + sec;
		return dateStr = d + "/" + m + "/" + y;
	} catch (e) {
		dateStr = "";
	}
	return dateStr;
}

function convertNumbertoString(number) {
	var numberStr = "";
	try {
		if (number != null && number != undefined) {
			numberStr = number.toString();
		}
	} catch (e) {

	}
	return numberStr;
}

// ================= END load HTML ===========================




// ============= Start EXPORT HTML =======================
this.getHtmlExport = function (exportType) {
	htmlContent = modifiedHtml('allvoice', exportType);
	return htmlContent;
}

/*
* Loc bo tat ca cac tag trong <body> HTML tru id duoc truyen vao
*/
function modifiedHtml(eleToKeep, exportType) {
	var htmlToKeep = tinyMceDocument.getElementById(eleToKeep).outerHTML;
	// Bỏ màu xanh và đỏ
	htmlToKeep = htmlToKeep
		.replace(/rgba\(245, 39, 39, 0\.54\)/g, '#FFF')
		.replace(/#a7ff83/g, '#FFF');
	var html = document.documentElement.outerHTML;
	var parser = new DOMParser();
	var tempDoc = parser.parseFromString(html, "text/html");
	var tempBody = tempDoc.body;
	console.log(htmlToKeep);
	tempBody.innerHTML = htmlToKeep;
	var css = "<style> " + document.getElementById('css_khong_chi_muc').innerHTML;
	// + document.getElementById('css_export_file').innerHTML;
	if (exportType == 'docx') {
		css += '  .container {padding: 0 !important;}  ';
		css += document.getElementById('css_export_file_docx').innerHTML;
	} else {
		css += document.getElementById('css_export_file_pdf').innerHTML;
	}
	css += " </style> ";
	tempDoc.head.innerHTML = css;
	convertHeadingIndex(tempDoc);
	//	if (exportType == 'docx') {
	//		tempBody.innerHTML = applyAllStylesToElements(tempBody.innerHTML, tempDoc.head.innerHTML);
	//	}
	var modifiedHtml = tempDoc.documentElement.outerHTML;
	return modifiedHtml;
}

function parseCSSRules(cssText) {
	const cssRules = {};
	const styleSheet = new CSSStyleSheet();
	styleSheet.replaceSync(cssText);

	for (const rule of styleSheet.cssRules) {
		if (rule.type === CSSRule.STYLE_RULE) {
			const selector = rule.selectorText;
			const style = rule.style;
			const ruleObject = {};
			for (let i = 0; i < style.length; i++) {
				const property = style[i];
				ruleObject[property] = style.getPropertyValue(property);
			}
			cssRules[selector.slice(1)] = ruleObject; // Remove '.' from class name
		}
	}
	return cssRules;
}

function applyAllStylesToElements(htmlString, cssText) {
	// Parse CSS rules from the provided CSS text
	const cssRules = parseCSSRules(cssText);

	// Convert HTML string to a DOM element
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');

	// Apply styles to all elements inside the parsed HTML
	const elements = doc.body.querySelectorAll('*');

	elements.forEach(element => {
		if (element.className) {
			applyClassStyles(element, cssRules);
		}
	});

	// Return the modified HTML as a string
	return doc.body.innerHTML;
}
/*
 áp css inline vào từ dòng
*/
function applyClassStyles(element, cssRules) {
	const classes = element.className.split(' ');

	// Tạo một object để chứa các thuộc tính style
	const styleObject = {};

	classes.forEach(className => {
		if (cssRules[className]) {
			const rule = cssRules[className];
			for (let property in rule) {
				styleObject[property] = rule[property];
			}
		}
	});

	// Áp dụng tất cả các thuộc tính vào thuộc tính style của phần tử
	for (let property in styleObject) {
		element.style[property] = styleObject[property];
	}
}
/*
 * Chuyen cac chi muc tu ::before thanh span de xuat Docx
 */
function convertHeadingIndex(html) {
	// Khởi tạo chỉ số
	var idxLv1 = 0; // Chương
	var idxLv2 = 0; // Điều
	var idxLv3 = 0; // 1.
	var idxLv4 = 0; // 1.1
	var idxLv5 = 96; // Unicode a b c d

	// Lưu tất cả các tiêu đề vào mảng
	var headings = Array.from(html.getElementsByClassName("heading"));
	for (let i = 0; i < headings.length; i++) {
		let newContent = '';
		let newTable = '';

		// Nội dung
		let content = headings[i].outerHTML;

		if (headings[i].classList.contains("no-counter")) {
			continue;
		}
		if (headings[i].classList.contains("section")) {
			newContent = `<span style='font-weight: bold; margin-right: 10px;'>Điều ${++idxLv2}.</span>`;
			idxLv3 = 0; // Reset số thứ tự khi gặp Điều
			idxLv4 = 0; // Reset tiểu mục khi gặp số mới
			idxLv5 = 96; // Reset chữ cái khi gặp tiểu mục mới

			newTable = `
				<table class="table-export">
					<tr>
						<td  class="table-export-index-heading"><p>${newContent}</p></td>
						<td><p>${content}</p></td>
					</tr>
				</table>
			`;

		} else if (headings[i].classList.contains("number")) {
			newContent = `<span style='font-weight: bold; margin-right: 10px;'>${++idxLv3}.</span>`;
			idxLv4 = 0; // Reset tiểu mục khi gặp số mới
			idxLv5 = 96; // Reset chữ cái khi gặp tiểu mục mới

			newTable = `
				<table class="table-export">
					<tr>
						<td  class="table-export-index-heading"><p>${newContent}</p></td>
						<td><p>${content}</p></td>
					</tr>
				</table>
			`;
		} else if (headings[i].classList.contains("subnumber")) {
			newContent = `<span style='font-weight: bold; margin-right: 10px;'>${idxLv3}.${++idxLv4}.</span>`;
			idxLv5 = 96; // Reset chữ cái khi gặp tiểu mục mới

			newTable = `
				<table class="table-export">
					<tr>
						<td  class="table-export-index-heading"><p>${newContent}</p></td>
						<td><p>${content}</p></td>
					</tr>
				</table>
			`;
		} else if (headings[i].classList.contains("subletter")) {
			newContent = `<span style='font-weight: bold; margin-right: 10px;'>${String.fromCharCode(++idxLv5)})</span>`;

			newTable = `
				<table class="table-export">
					<tr>
						<td  class="table-export-index-heading"><p>${newContent}</p></td>
						<td><p>${content}</p></td>
					</tr>
				</table>
			`;
		}
		headings[i].innerHTML = newTable;
	}

	// Lưu tất cả các bullet points vào mảng
	var bulletPoints = Array.from(html.getElementsByClassName("bullet"));
	for (let i = 0; i < bulletPoints.length; i++) {
		let bulletSymbol = '';
		if (bulletPoints[i].classList.contains("bullet-level-1")) {
			bulletSymbol = "-";
		} else if (bulletPoints[i].classList.contains("bullet-level-2")) {
			bulletSymbol = "•";
		} else if (bulletPoints[i].classList.contains("bullet-level-3")) {
			bulletSymbol = "◦";
		} else if (bulletPoints[i].classList.contains("bullet-level-4")) {
			bulletSymbol = "▪";
		}

		// Thay thế bullet bằng bảng
		let bulletContent = bulletPoints[i].outerHTML;
		let newBulletTable = `
                        <table  class="table-export">
                            <tr>
                                <td  class="table-export-index-bullet"><p>${bulletSymbol}</p></td>
                                <td><p>${bulletContent}</p></td>
                            </tr>
                        </table>
                    `;
		bulletPoints[i].innerHTML = newBulletTable;
	}
}

// =============== END EXPORT HTML ========================


// =============== START HTML diff ========================

this.diffDocument = function () {
	var orgContent = context.options.contentHTML.get("value");
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = orgContent;

	// Lấy nội dung bên trong thẻ bao ngoài cùng
	const innerContent = tempDiv.querySelector("#allvoice").outerHTML;
	console.log("============== HTML hiện tại trước khi so sánh innerContent===========");
	console.log(innerContent);

	var curContent = tinyMceDocument.getElementById("allvoice").outerHTML;
	console.log("============== HTML hiện tại trước khi so sánh curContent===========");
	console.log(curContent);

	orgContent = removeIds(innerContent);
	curContent = removeIds(curContent);
	var diffHtml = htmldiff(innerContent, curContent);
	console.log("============== HTML hiện tại trước khi so sánh diffHtml===========");
	console.log(diffHtml);
	document.getElementById('diffOutput').innerHTML = diffHtml;

}

function removeIds(htmlString) {
	// Tạo một DOM từ chuỗi HTML
	var parser = new DOMParser();
	var doc = parser.parseFromString(htmlString, 'text/html');

	// Tìm tất cả các phần tử có thuộc tính id và loại bỏ chúng
	doc.querySelectorAll('[id]').forEach(function (element) {
		element.removeAttribute('id');
	});

	// Chuyển đổi lại DOM thành chuỗi HTML
	return doc.body.outerHTML;
}


// =============== END HTML diff ===========================

// =================== START update thông tin các trường vào HTML ==========================
this.loadBpmToHTML = loadBpmToHTML;
function loadBpmToHTML(htmlId, bpmId) {
	try {
		// Lấy value BPM tùy theo kiểu dữ liệu
		var bpmValue = "";
		var bpmInput = view.ui.getParent().ui.get(bpmId);
		if (!bpmInput) {
			return;
		}
		var bpmInputType = bpmInput.getType() || "";
		if (bpmInputType == "text.3") {
			bpmValue = bpmInput.getData() || "";
		} else if (bpmInputType == "integer.3" || bpmInputType == "decimal.3") {
			bpmValue = convertNumbertoString(bpmInput.getData()) || "";
		} else if (bpmInputType == "dateTimePicker.3") {
			bpmValue = fomatDate(bpmInput.getDate());
		} else if (bpmInputType == "singleSelect.3") {
			bpmValue = bpmInput.getItemText(bpmInput.getSelectedItem());
		}

		// Update HTML
		var htmlEle = tinyMceDocument.getElementById(htmlId);
		if (!htmlEle) {
			console.warn("updateContentHTML tag id " + htmlId + " does not exist in HTML file");
			return;
		}
		if (!!bpmValue) {
			htmlEle.textContent = bpmValue;
			htmlEle.contentEditable = false;
			htmlEle.style.backgroundColor = colorRed;
		} else if (/[a-zA-Z0-9&_\-!@#$%^&*(){},/?\\]/.test(htmlEle.textContent)) {
			// htmlEle.contentEditable = true;
			htmlEle.textContent = "...";
			htmlEle.contentEditable = false;
			htmlEle.style.backgroundColor = '';
		} else {
			// htmlEle.contentEditable = true;
			htmlEle.contentEditable = false;
			htmlEle.style.backgroundColor = '';
		}
	} catch (e) {
		console.error("ERROR ---- updateContentHTML with" + "htmlId =" + htmlId + "--- Detail ERROR ---" + e.toString());
	}
}

// =================== END update thông tin các trường vào HTML ==========================
this.insertHtmlIntoElementById = insertHtmlIntoElementById;
function insertHtmlIntoElementById(elementId, htmlString) {
    try {
        // Lấy phần tử bằng ID
		var element = tinyMceDocument.getElementById(elementId);

        // Kiểm tra phần tử có tồn tại không
        if (!element) {
            console.warn(`Phần tử với ID '${elementId}' không tồn tại.`);
            return;
        }

        // Thêm HTML vào bên trong phần tử
        element.innerHTML  = htmlString;

        console.log(`Đã thêm HTML vào phần tử có ID: ${elementId}`);
    } catch (error) {
        console.error(`Lỗi khi thêm HTML vào phần tử có ID '${elementId}':`, error);
    }
}