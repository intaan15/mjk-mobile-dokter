// import React, { useState } from "react";
// import { View, Button } from "react-native";
// import ModalTemplate from "../../Components/ModalTemplate";
// import ModalContent from "../../Components/ModalContent";
// import ImagePickerComponent, { useImage } from "../../Components/imagepicker";

// const App = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [modalType, setModalType] = useState("info");

//   const openModal = (type: string) => {
//     setModalType(type);
//     setModalVisible(true);
//   };

//   const imageContext = useImage();
//   const profileImage = imageContext?.profileImage;
//   const setImage = imageContext?.setImage;

//   const { openGallery, openCamera } = ImagePickerComponent({
//     onImageSelected: setImage,
//   });

//   return (
//     <View style={{ padding: 20 }}>
//       <Button title="Konfirm" onPress={() => openModal("konfirm")} />
//       <Button title="Hapus Akun" onPress={() => openModal("hapusakun")} />
//       <Button title="Keluar Akun" onPress={() => openModal("keluarakun")} />
//       <Button
//         title="Atur secara default"
//         onPress={() => openModal("jadwaldefault")}
//       />
//       <Button title="Image" onPress={() => openModal("pilihgambar")} />
//       <Button title="Jam" onPress={() => openModal("pilihjam")} />

//       <ModalTemplate
//         isVisible={isModalVisible}
//         onClose={() => setModalVisible(false)}
//       >
//         <ModalContent
//           modalType={modalType}
//           onPickImage={openGallery}
//           onOpenCamera={openCamera}
//           onClose={() => setModalVisible(false)}
//         />
//       </ModalTemplate>
//     </View>
//   );
// };

// export default App;
