$('.close-modal').click(function(){
	$('#welcomeModal').modal('hide');
})

$('#welcomeModal').on('hidden.bs.modal', function() {
	window.sessionStorage.setItem('begin', 0);
});