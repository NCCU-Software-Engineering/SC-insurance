$("#test").click(function () {
    $.post("sign_in", $("#sign_in-form").serialize(), function (data) {
        if (data.isSuccess) {
            swal({
                title: data.result,
                text: "即將導向回首頁",
                type: "success",
                closeOnConfirm: false
            }, () => { window.location = '/' })
        }
        else {
            swal({
                title: data.result,
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
                function () {
                    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                });

        }
    });
})