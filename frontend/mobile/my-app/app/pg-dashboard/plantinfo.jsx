import React, { useState } from "react";
import { LogBox } from "react-native";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

// Import Components
import PlantInfoContainer from "../../components/PGdashboard/PlantInfo/PlantInfoContainer";
import PageHeader from "../../components/PGdashboard/PlantInfo/PageHeader";
import PlantItem from "../../components/PGdashboard/PlantInfo/PlantItem";
import PlantDetailModal from "../../components/PGdashboard/PlantInfo/PlantDetailModal";

const PlantInfo = () => {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const orchids = [
        {
            name: "Phalaenopsis Orchid",
            description:
                "Also known as the 'Moth Orchid', it is one of the most popular orchids.",
            image: require("../../assets/images/phalaenopsis.jpg"),
            scientificName: "Phalaenopsis",
            habitat: "Tropical Asia and Australia",
            funFact:
                "It is called the 'Moth Orchid' because its flowers resemble moths in flight.",
        },
        {
            name: "Cattleya Orchid",
            description:
                "Known as the 'Queen of Orchids', it is famous for its large, fragrant flowers.",
            image: require("../../assets/images/cattleya.jpg"),
            scientificName: "Cattleya",
            habitat: "Tropical America",
            funFact:
                "Cattleya orchids are often used in corsages due to their beauty and fragrance.",
        },
        {
            name: "Dendrobium Orchid",
            description: "A diverse genus of orchids with over 1,800 species.",
            image: require("../../assets/images/dendrobium.jpg"),
            scientificName: "Dendrobium",
            habitat: "Asia, Australia, and the Pacific Islands",
            funFact:
                "Dendrobium orchids are used in traditional medicine in some cultures.",
        },
    ];

    const openModal = (plant) => {
        setSelectedPlant(plant);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedPlant(null);
        setModalVisible(false);
    };

    return (
        <PlantInfoContainer>
            <PageHeader />

            {orchids.map((orchid, index) => (
                <PlantItem key={index} plant={orchid} onPress={openModal} />
            ))}

            <PlantDetailModal
                plant={selectedPlant}
                visible={modalVisible}
                onClose={closeModal}
            />
        </PlantInfoContainer>
    );
};

export default PlantInfo;
