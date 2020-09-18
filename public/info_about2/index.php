<?php
    $page='profile';
    include_once('../header.php');
    include_once('../sail.php');
    $sail= new Sail($mysql);
    $ui=$user->info($id);
    $si=$sail->info($id);
     if(isset($_POST['name']) AND isset($_POST['surname']) AND isset($_POST['email'])){
    $user->change_profile($id,$_POST['name'],$_POST['surname'],$_POST['email']);
    $ui=$user->info($id);
  }
  if(isset($_POST['ship_name']) AND isset($_POST['ship_color'])){
    if(isset($_POST['ship_class'])){
      $sail->info_update($id,$_POST['ship_name'],$_POST['ship_color'],$_POST['ship_class']);
    }else{
      $sail->info_update($id,$_POST['ship_name'],$_POST['ship_color']);
    }
    $si=$sail->info($id);
  }
  if(!empty($_FILES)){
    echo $user->upload_profile_photo($id,$_FILES);
    echo "<script>window.location='/info_about2';</script>";
  }

  ?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Информация</title>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="/styles/null.css">
    <link rel="stylesheet" href="/styles/header.css">


</head>
<body>
        <link rel="stylesheet" href="/styles/info_about.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossorigin=""/>
<div class="wrapper">

    <div class="content">
        <form method='post' action='/test/build/index.html' class="form-reg">
            <div class="tabs__body">
                <div class="tabs__block" id="tab_02">
                    <div class="tabs__top">
                        <div class="tabs__title">Входные параметры</div>
                        <div class="tabs__red">Ваш личный токен:
                            <div class="token" id="token"><?php echo $ui['token']; ?></div>
                        </div>
                    </div>

                    <div class="tabs__info">
                        <div class="tabs__list tabs-list">
                            <div class="tabs-list__conent">

                                <div class="tabs-list__email tabs-list__item">Название яхты:</div>
                                <div class="tabs-list__color tabs-list__item">Выбор цвета:
                                </div>
                                <div class="tabs-list__bui1 tabs-list__item">Класс судна:
                                </div>
                                <div class="tabs-list__bui1 tabs-list__item" id="portName">Координаты 1 буя(port):
                                </div>
                                <div class="tabs-list__bui2 tabs-list__item" id="starboardName">Координаты 2 буя(starboard):
                                </div>
                            </div>
                        </div>
                        <div class="tabs__input tabs-input">
                            <div class="tabs-input__text1 tabs-input__item">
                                <input type="text" readonly placeholder="<?php echo $si['name']; ?>" required tabindex="1" name='name' value="<?php echo $si['name']; ?>">
                            </div>
                            <div class="tabs-input__text2 ">
                                <input type="color" readonly tabindex="2" name="color" id="color" value="<?php echo $si['color']; ?>">
                            </div>
                            <div class=" tabs-input__text2 item-class ">
                                <?php $sail->show_class()?>
                            </div>
                            <div class=" tabs-input__item tabs-input__text3">
                                <input class="tabs-input__input-lang" type="text" placeholder="lang" tabindex="3"
                                       name='lang1' id="portLang">
                                <input class="tabs-input__input-lat" type="text" placeholder="lat" tabindex="4"
                                       name='lat1' id="portLat">
                            </div>
                            <div class=" tabs-input__item tabs-input__text3">
                                <input class="tabs-input__input-lang" type="text" placeholder="lang" tabindex="5"
                                       name='lang2' id="starboardLang">
                                <input class="tabs-input__input-lat" type="text" placeholder="lat" tabindex="6"
                                       name='lat2' id="starboardLat">
                            </div>
                        </div>
                    </div>

                    <div id="mapid"></div>

                    <div class="submit">
                        <input type='submit' class="submit__btn" value="Далее" >
                    </div>
                </div>
                <div class="block__null"></div>
            </div>
        </form>
    </div>
</div>
</body>

<style>
    #mapid {
        height: 200px;
    }

    .hidden {
        display: none;
    }
</style>

<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
        crossorigin=""></script>
<script src="info_about.js"></script>
</html>