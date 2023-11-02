$(document).ready(function() {
    $('#tableProduk').DataTable();

    $("#bahanModals").click(function() {
        var produkValue = $("#namaProduk").val();
      
        if (produkValue.trim() === "") {
          Swal.fire({
            icon: 'warning',
            title: 'Produk Kosong',
            text: 'Mohon pilih produk terlebih dahulu sebelum menambahkan bahan.',
            showConfirmButton: true,
          });
        } else {
          $("#bahanModal").modal("show");
        }
      });

    $(".btnProduk").click(function() {
        var kode = $(this).data("kode");
        var nama = $(this).data("nama");
    
        // Isi input teks pada halaman utama dengan data produk
        $("#kodeProduk").val(kode);
        $("#namaProduk").val(nama);
        
        $("#productModal").modal("hide");

        $("#jumlahProduk").focus();
      });

    $(".btnBahan").click(function() {
        var kode = $(this).data("kode");
        var nama = $(this).data("nama");
        var jumlah = $(this).data("jumlah");
    
        // Isi input teks pada halaman utama dengan data produk
        $("#kodeBahan").val(kode);
        $("#namaBahan").val(nama);
        $("#jumlahBahan").val(jumlah);

        $("#bahanModal").modal("hide");
      });

      $("#tambahBahan").click(function() {
        var kode = $("#kodeBahan").val();
        var nama = $("#namaBahan").val();
        var jumlah = $("#jumlahBahan").val();

        if(kode.trim() !== "" || nama.trim() !== "" || jumlah.trim() !== "") {

            let isDuplicate = false;
            $("#tableBahan #bodyBahan tr").each(function() {
                var kodeBahan = $(this).find("td:eq(0)").text();
                if(kodeBahan === kode) {
                    isDuplicate = true;
                    return false;
                }
            });

            if(!isDuplicate) {
                var table = 
                '<tr>' +
                    '<td>' + kode + '</td>' +
                    '<td>' + nama + '</td>' +
                    '<td class="text-center">'+
                        '<div class="input-group mb-3">'+
                            '<span class="input-group-text" id="basic-addon1">Qty</span>'+
                            '<input type="hidden" value="'+ jumlah +'" id="batasStok" class="form-control" placeholder="Qty" aria-label="Username" aria-describedby="basic-addon1">'+
                            '<input type="text" value="1" id="inputJumlah" class="form-control" placeholder="Qty" aria-label="Username" aria-describedby="basic-addon1">'+
                        '</div>'+ 
                    '</td>' +
                    '<td class="text-center">' +
                        '<button class="btn btn-danger hapusBahan" type="button">X</button>' +
                    '</td>' +
                '</tr>';
                $("#tableBahan #bodyBahan").append(table);

                var kode = $("#kodeBahan").val("");
                var nama = $("#namaBahan").val("");
                var jumlah = $("#jumlahBahan").val("");

                if($("#tableBahan #bodyBahan #empty-data").length > 0) {
                    $("#empty-data").hide();
                }else{
                    $("#empty-data").show();
                }

                $("#tableBahan #bodyBahan tr").each(function() {
                    var row = $(this);
                    var inputBahan = row.find('input#inputJumlah');
                    var maxInputValue = row.find('input#batasStok').val();
            
                    inputBahan.on('keyup', function() {
                        var inputValue = parseInt($(this).val());
                        if (inputValue > maxInputValue) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Batas input',
                                text: 'Jumlah yang anda inputkan melebihi stok bahan.',
                                showConfirmButton: true,
                            });
                            $(this).val(maxInputValue);
                        }
                    });
                });

            }else{
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplikat Bahan',
                    text: 'Bahan yang anda pilih sudah ada.',
                    showConfirmButton: true,
                });
            }
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Bahan Kosong',
                text: 'Mohon pilih bahan terlebih dahulu sebelum menambahkan.',
                showConfirmButton: true,
            });
        }
    
      });

        $("#tableBahan").on("click", ".hapusBahan", function() {
            $(this).closest("tr").remove();
        });

});

function modalCetak() {
    $("#tableBahan #bodyBahan #empty-data").remove();
    var namaProduk = $("#namaProduk").val();
    var kodeProduk = $("#kodeProduk").val();
    var jumlahProduk = $("#jumlahProduk").val();

    if (namaProduk.trim() === '' || kodeProduk.trim() === '' || jumlahProduk.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Data Produk Belum Lengkap',
            text: 'Mohon isi semua data produk sebelum mencetak.',
            showConfirmButton: true,
        });
        return;
    }

    // Validasi apakah data bahan dalam tabel masih kosong
    var jumlahBarisBahan = $("#tableBahan #bodyBahan tr").length;

    // Validasi apakah data bahan dalam tabel masih kosong
    if (jumlahBarisBahan === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Data Bahan Kosong',
            text: 'Tabel bahan tidak memiliki data. Mohon tambahkan data bahan sebelum mencetak.',
            showConfirmButton: true,
        });
        return;
    }
    
    // Mengisi data modal dengan nilai dari form
    $("#cetakKode").val(namaProduk);
    $("#cetakNama").val(kodeProduk);
    $("#cetakJumlah").val(jumlahProduk);
    
    // Mengisi data modal dengan data bahan dari tabel
    var dataBahanTable = '<table class="table table-bordered"><thead><tr><th>Kode Bahan</th><th>Nama Bahan</th><th>Jumlah Bahan</th></tr></thead><tbody>';
    $("#tableBahan #bodyBahan tr").each(function() {
        var kodeBahan = $(this).find("td:eq(0)").text();
        var namaBahan = $(this).find("td:eq(1)").text();
        var jumlahBahan = $(this).find("input#inputJumlah").val();
        dataBahanTable += '<tr><td>' + kodeBahan + '</td><td>' + namaBahan + '</td><td>' + jumlahBahan + '</td></tr>';
    });
    dataBahanTable += '</tbody></table>';
    $("#modalDataBahan").html(dataBahanTable);

    $("#cetak").modal("show");
}